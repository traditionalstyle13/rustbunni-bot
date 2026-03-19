import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { TARGETS, findTarget, gradeEmoji } from '../data/targets.js';

export const data = new SlashCommandBuilder()
  .setName('ecoraid')
  .setDescription('Get eco (no sulfur) raid methods — melee, handmade shells, molotovs')
  .addStringOption(opt =>
    opt.setName('target')
      .setDescription('What do you want to eco raid?')
      .setRequired(true)
      .setAutocomplete(true)
  )
  .addIntegerOption(opt =>
    opt.setName('players')
      .setDescription('Number of players (divides quantities)')
      .setMinValue(1)
      .setMaxValue(10)
  )
  .addIntegerOption(opt =>
    opt.setName('qty')
      .setDescription('Number of targets (default: 1)')
      .setMinValue(1)
      .setMaxValue(20)
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
  const players = interaction.options.getInteger('players') || 1;
  const qty = interaction.options.getInteger('qty') || 1;

  const t = TARGETS.find(t => t.id === targetId) || findTarget(targetId);
  if (!t) {
    return interaction.reply({ content: `❌ Target not found. Use autocomplete to pick a valid target.`, ephemeral: true });
  }

  const eco = t.eco;
  const qtyLabel = qty > 1 ? ` ×${qty}` : '';
  const softsideWarning = eco.softside
    ? '⚠️ **SOFT SIDE ONLY** — must hit the weak face\n\n'
    : '✅ **All sides** — same damage from any angle\n\n';

  let fields = [];

  // Best eco method
  const bestQty = Math.ceil((eco.best.qty * qty) / players);
  fields.push({
    name: `⭐ Best Eco — ${eco.best.tool}`,
    value: `**${bestQty}×** ${eco.best.tool}${players > 1 ? ` *(${eco.best.qty * qty} total ÷ ${players} players)*` : ''}`,
    inline: true
  });

  // Alt eco method
  if (eco.alt) {
    const altQty = Math.ceil((eco.alt.qty * qty) / players);
    fields.push({
      name: `🔄 Alternative — ${eco.alt.tool}`,
      value: `**${altQty}×** ${eco.alt.tool}${players > 1 ? ` *(${eco.alt.qty * qty} total ÷ ${players} players)*` : ''}`,
      inline: true
    });
  }

  // Handmade shells
  if (eco.shells) {
    const shellQty = eco.shells.qty * qty;
    const sulfurCost = eco.shells.sulfur * qty;
    const stoneCost = eco.shells.stone ? eco.shells.stone * qty : sulfurCost * 2;
    const shellNote = eco.shells.note || '';
    fields.push({
      name: '🔫 Handmade Shells',
      value: `**${shellQty}** shells\n🔥 ${sulfurCost.toLocaleString()} sulfur + 🪨 ${stoneCost.toLocaleString()} stone${shellNote ? `\n*${shellNote}*` : ''}`,
      inline: false
    });
  }

  const embed = new EmbedBuilder()
    .setColor(0x6ec9a0)
    .setTitle(`🌿 Eco Raid — ${t.emoji} ${t.name}${qtyLabel}`)
    .setDescription(`${gradeEmoji(t.grade)} **${t.grade.toUpperCase()}** · ${(t.hp * qty).toLocaleString()} HP\n\n${softsideWarning}${eco.note ? `*${eco.note}*` : ''}`)
    .addFields(fields)
    .setFooter({ text: `Use /raid for explosive methods  |  Players: ${players}  |  Qty: ${qty}` })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
