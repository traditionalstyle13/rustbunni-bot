import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

const ITEMS = {
  'c4':       { name:'Timed Explosive Charge (C4)', sulfur:2200, gunpowder:1000, charcoal:3000 },
  'rocket':   { name:'Rocket', sulfur:1400, gunpowder:600, charcoal:1800 },
  'satchel':  { name:'Satchel Charge', sulfur:480, gunpowder:240, charcoal:720 },
  'explo':    { name:'Explosive Ammo (×1)', sulfur:25, gunpowder:10, charcoal:30 },
  'hv':       { name:'HV Rocket', sulfur:200, gunpowder:100, charcoal:300 },
  'incen':    { name:'Incendiary Rocket', sulfur:250, gunpowder:125, charcoal:375 },
  'f1':       { name:'F1 Grenade', sulfur:60, gunpowder:30, charcoal:90 },
  'shells':   { name:'Handmade Shells (×2)', sulfur:10, gunpowder:10, charcoal:0, note:'No workbench required — 5 sulfur + 5 GP = 2 shells' },
};

export const data = new SlashCommandBuilder()
  .setName('sulfur')
  .setDescription('How much sulfur to craft a quantity of raid items')
  .addStringOption(opt =>
    opt.setName('item')
      .setDescription('What item?')
      .setRequired(true)
      .addChoices(
        { name: '💛 Timed C4', value: 'c4' },
        { name: '🚀 Rocket', value: 'rocket' },
        { name: '🧨 Satchel Charge', value: 'satchel' },
        { name: '🔴 Explosive Ammo', value: 'explo' },
        { name: '💨 HV Rocket', value: 'hv' },
        { name: '🔥 Incendiary Rocket', value: 'incen' },
        { name: '💣 F1 Grenade', value: 'f1' },
        { name: '🔫 Handmade Shells', value: 'shells' },
      )
  )
  .addIntegerOption(opt =>
    opt.setName('qty')
      .setDescription('How many?')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(1000)
  );

export async function execute(interaction) {
  const itemKey = interaction.options.getString('item');
  const qty = interaction.options.getInteger('qty');
  const item = ITEMS[itemKey];

  const sulfur = item.sulfur * qty;
  const gp = item.gunpowder * qty;
  const charcoal = item.charcoal * qty;

  // Charcoal to smelt sulfur: 1 sulfur ore = 1 sulfur + 1 charcoal when smelted
  // So charcoal needed ≈ sulfur amount (to smelt the ore)
  const totalCharcoal = charcoal + sulfur; // charcoal from recipe + charcoal to smelt sulfur ore

  const embed = new EmbedBuilder()
    .setColor(0xf4d03f)
    .setTitle(`🔥 ${qty}× ${item.name}`)
    .addFields(
      { name: '🔥 Sulfur', value: sulfur.toLocaleString(), inline: true },
      { name: '⚫ Gunpowder', value: gp.toLocaleString(), inline: true },
      { name: '🪵 Charcoal (total)', value: totalCharcoal.toLocaleString(), inline: true },
    )
    .setFooter({ text: item.note || 'Charcoal total includes smelting sulfur ore' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
