import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { cancelDecay, listDecays } from '../decayScheduler.js';

export const data = new SlashCommandBuilder()
  .setName('decaycancel')
  .setDescription('Cancel an active decay timer')
  .addIntegerOption(opt =>
    opt.setName('id')
      .setDescription('Timer ID from /decay (shown as #1, #2 etc.)')
      .setRequired(true)
      .setMinValue(1)
  );

export async function execute(interaction) {
  const id = interaction.options.getInteger('id');

  // Check user owns this timer
  const userTimers = listDecays(interaction.user.id);
  const owns = userTimers.some(t => t.id === id);

  if (!owns) {
    return interaction.reply({
      content: `❌ No active timer **#${id}** found for your account. Use \`/decaylist\` to see your timers.`,
      ephemeral: true,
    });
  }

  const meta = cancelDecay(id);

  const embed = new EmbedBuilder()
    .setColor(0x6ec9a0)
    .setTitle('✅ Decay Timer Cancelled')
    .addFields(
      { name: '🆔 Timer',      value: `#${id}`,           inline: true },
      { name: '🏚️ Was',        value: meta.tierLabel,     inline: true },
      { name: '❤️ HP',          value: `${meta.hp}`,       inline: true },
    );

  if (meta.coords) {
    embed.addFields({ name: '📍 Coords', value: `\`${meta.coords}\``, inline: false });
  }

  embed.setFooter({ text: 'No more reminders will be sent for this timer.' });

  await interaction.reply({ embeds: [embed] });
}
