import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { scheduleDecay, TIERS, formatTimeLeft } from '../decayScheduler.js';

export const data = new SlashCommandBuilder()
  .setName('decay')
  .setDescription('Start a decay timer — bot will DM you 5 mins before and when it\'s gone')
  .addStringOption(opt =>
    opt.setName('tier')
      .setDescription('Building material tier')
      .setRequired(true)
      .addChoices(
        { name: '🪵 Twig   — 1h full decay  (100 HP max)', value: 'twig'    },
        { name: '🌲 Wood   — 3h full decay  (250 HP max)', value: 'wood'    },
        { name: '🧱 Stone  — 5h full decay  (500 HP max)', value: 'stone'   },
        { name: '🏗️ Metal  — 8h full decay  (1000 HP max)', value: 'metal'   },
        { name: '🛡️ Armored — 12h full decay (2000 HP max)', value: 'armored' },
      )
  )
  .addIntegerOption(opt =>
    opt.setName('hp')
      .setDescription('Current HP of the structure (e.g. 347)')
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(2000)
  )
  .addStringOption(opt =>
    opt.setName('coords')
      .setDescription('Base location e.g. "G14" or "123456, 78901" — included in reminder DMs')
      .setRequired(false)
  );

export async function execute(interaction) {
  const tier   = interaction.options.getString('tier');
  const hp     = interaction.options.getInteger('hp');
  const coords = interaction.options.getString('coords') || null;

  const t = TIERS[tier];

  // Clamp HP to tier max
  const clampedHp = Math.min(hp, t.maxHp);
  if (hp > t.maxHp) {
    await interaction.reply({
      content: `⚠️ **${t.label}** has a max HP of **${t.maxHp}**. I've clamped your value to ${t.maxHp}.`,
      ephemeral: true,
    });
  }

  // Check bot can DM this user
  try {
    const user = await interaction.client.users.fetch(interaction.user.id);
    await user.createDM();
  } catch {
    return interaction.reply({
      content: `❌ I can't send you DMs! Please enable **"Allow direct messages from server members"** in your Discord Privacy settings, then try again.`,
      ephemeral: true,
    });
  }

  const { id, decayAt, decayMs, tier: tierData } = scheduleDecay(
    interaction.client,
    interaction.user.id,
    tier,
    clampedHp,
    coords
  );

  const hpPct = Math.round((clampedHp / t.maxHp) * 100);
  const decayHours = (decayMs / 3600_000).toFixed(1);
  const warnAt = new Date(decayAt.getTime() - 5 * 60_000);
  const decayTimestamp = Math.floor(decayAt.getTime() / 1000);
  const warnTimestamp  = Math.floor(warnAt.getTime()  / 1000);

  const hpBar = buildHpBar(hpPct);

  const embed = new EmbedBuilder()
    .setColor(tierData.color)
    .setTitle(`⏳ Decay Timer Started — ${t.label}`)
    .setDescription(`Timer **#${id}** is running. I'll DM you **5 minutes before** it decays and again **when it's gone**.`)
    .addFields(
      { name: '🏚️ Tier',            value: t.label,                                        inline: true },
      { name: '❤️ HP',               value: `**${clampedHp}** / ${t.maxHp} (${hpPct}%)`,   inline: true },
      { name: '🆔 Timer ID',         value: `\`#${id}\``,                                   inline: true },
      { name: '⏱️ Time Left',        value: `~${decayHours} hours`,                         inline: true },
      { name: '⚠️ Warning DM at',    value: `<t:${warnTimestamp}:T> (<t:${warnTimestamp}:R>)`, inline: true },
      { name: '💀 Fully gone at',    value: `<t:${decayTimestamp}:T> (<t:${decayTimestamp}:R>)`, inline: true },
      { name: '📊 Health',           value: hpBar,                                           inline: false },
    );

  if (coords) {
    embed.addFields({ name: '📍 Coordinates', value: `\`${coords}\``, inline: false });
  }

  embed.addFields({
    name: '💡 Manage',
    value: `Use \`/decaylist\` to see all your active timers\nUse \`/decaycancel id:${id}\` to cancel this timer`,
  });

  embed.setFooter({ text: 'Decay assumes TC is empty and structure is actively decaying | Vanilla server rates' });

  await interaction.reply({ embeds: [embed] });
}

function buildHpBar(pct) {
  const filled = Math.round(pct / 10);
  const empty  = 10 - filled;
  const bar = '🟥'.repeat(Math.max(0, filled)) + '⬛'.repeat(Math.max(0, empty));
  return `${bar} ${pct}%`;
}
