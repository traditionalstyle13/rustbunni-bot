import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { listDecays, TIERS, formatTimeLeft } from '../decayScheduler.js';

export const data = new SlashCommandBuilder()
  .setName('decaylist')
  .setDescription('List all your active decay timers');

export async function execute(interaction) {
  const timers = listDecays(interaction.user.id);

  if (timers.length === 0) {
    return interaction.reply({
      content: '📭 You have no active decay timers. Use `/decay` to start one.',
      ephemeral: true,
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0xe67e22)
    .setTitle(`⏳ Your Active Decay Timers (${timers.length})`)
    .setTimestamp();

  for (const t of timers) {
    const timeLeft = formatTimeLeft(t.decayAt);
    const decayTimestamp = Math.floor(t.decayAt.getTime() / 1000);
    const hpPct = Math.round((t.hp / TIERS[t.tier].maxHp) * 100);
    const coordStr = t.coords ? ` · 📍 \`${t.coords}\`` : '';

    embed.addFields({
      name: `#${t.id} — ${t.tierLabel}`,
      value: [
        `❤️ **${t.hp} HP** (${hpPct}%)${coordStr}`,
        `💀 Gone <t:${decayTimestamp}:R> — exactly <t:${decayTimestamp}:f>`,
        `⏱️ **${timeLeft}** remaining · \`/decaycancel id:${t.id}\` to cancel`,
      ].join('\n'),
      inline: false,
    });
  }

  embed.setFooter({ text: 'Timers are stored in memory — they will reset if the bot restarts.' });

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
