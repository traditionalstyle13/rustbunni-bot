import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { TARGETS, findTarget, gradeEmoji, sulfurEmoji } from '../data/targets.js';

export const data = new SlashCommandBuilder()
  .setName('raid')
  .setDescription('Get all raid methods for a target structure')
  .addStringOption(opt =>
    opt.setName('target')
      .setDescription('What do you want to raid?')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption(opt =>
    opt.setName('qty')
      .setDescription('Number of targets (default: 1)')
      .setMinValue(1)
      .setMaxValue(50)
  );

export async function autocomplete(interaction) {
  const focused = interaction.options.getFocused().toLowerCase();
  const choices = TARGETS
    .filter(t => t.name.toLowerCase().includes(focused) || t.id.includes(focused))
    .slice(0, 25)
    .map(t => ({ name: `${t.emoji} ${t.name}`, value: t.id }));
  await interaction.respond(choices);
}

export async function execute(interaction) {
  const targetId = interaction.options.getString('target');
  const qty = interaction.options.getInteger('qty') || 1;

  const t = TARGETS.find(t => t.id === targetId) || findTarget(targetId);
  if (!t) {
    return interaction.reply({ content: `❌ Target **${targetId}** not found. Use the autocomplete to pick a valid target.`, ephemeral: true });
  }

  const totalHp = t.hp * qty;
  const qtyLabel = qty > 1 ? ` ×${qty}` : '';

  const methodLines = t.methods.map(m => {
    const items = m.items.map(i => `**${i.c * qty}×** ${i.n}`).join(' + ');
    const sulfurTotal = (m.sulfur || 0) * qty;
    const sEmoji = sulfurEmoji(sulfurTotal);
    const bestTag = m.best ? ' ⭐' : '';
    const noteStr = m.note ? `\n  ↳ *${m.note}*` : '';
    return `${sEmoji} **${m.name}**${bestTag} — ${items} *(${sulfurTotal.toLocaleString()} 🔥 sulfur)*${noteStr}`;
  }).join('\n');

  const embed = new EmbedBuilder()
    .setColor(0xd4718a)
    .setTitle(`${t.emoji} ${t.name}${qtyLabel}`)
    .setDescription(`${gradeEmoji(t.grade)} **${t.grade.toUpperCase()}** · ${totalHp.toLocaleString()} HP${t.softside ? '\n⚠️ **Soft side required for melee/eco methods**' : ''}`)
    .addFields(
      { name: '💣 Explosive Methods', value: methodLines },
    )
    .setFooter({ text: `⭐ = most sulfur efficient  |  Use /ecoraid for melee/handmade shell methods` })
    .setTimestamp();

  if (qty > 1) {
    embed.addFields({ name: `📦 Quantity Note`, value: `All quantities above are for **${qty} targets**. Single target costs are ÷${qty}.` });
  }

  await interaction.reply({ embeds: [embed] });
}
