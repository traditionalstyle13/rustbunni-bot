import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { findBreedingPath, scoreGene, geneBar, qualityLabel, parseGene, isValidGene } from '../data/breeding.js';

const TARGETS_MAP = {
  'gggyyy': 'GGGYYY',
  'ggyyyy': 'GGYYYY',
  'gggghy': 'GGGGHY',
};

export const data = new SlashCommandBuilder()
  .setName('breed')
  .setDescription('Calculate the breeding path to a god clone from your clones')
  .addStringOption(opt =>
    opt.setName('clones')
      .setDescription('Your clone genes, space or comma separated (e.g. GGYYWX GGWYYY GYGYYY)')
      .setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName('target')
      .setDescription('Target gene combo (default: GGGYYY)')
      .addChoices(
        { name: 'GGGYYY — 3G 3Y (default god clone)', value: 'gggyyy' },
        { name: 'GGYYYY — 2G 4Y (max yield)', value: 'ggyyyy' },
        { name: 'GGGGHY — 4G 1H 1Y (cold biome)', value: 'gggghy' },
      )
  );

export async function execute(interaction) {
  await interaction.deferReply();

  const raw = interaction.options.getString('clones');
  const targetKey = interaction.options.getString('target') || 'gggyyy';
  const target = TARGETS_MAP[targetKey];

  // Parse clones
  const tokens = raw.toUpperCase().split(/[\s,]+/).filter(Boolean);
  const seen = new Set();
  const clones = [];
  const invalid = [];

  for (const t of tokens) {
    const g = parseGene(t);
    if (isValidGene(g) && !seen.has(g)) {
      seen.add(g);
      clones.push(g);
    } else if (t.length > 0) {
      invalid.push(t);
    }
  }

  if (clones.length === 0) {
    return interaction.editReply('❌ No valid clones found. Each clone must be exactly 6 characters using G, Y, H, W, X only.\nExample: `/breed clones:GGYYWX GGWYYY GYGYYY`');
  }

  // Run breeding algorithm
  const result = findBreedingPath(clones, target);

  // Build embed
  const embed = new EmbedBuilder()
    .setColor(result.found ? 0x6ec9a0 : 0xf4d03f)
    .setTitle(result.found ? `🏆 Breeding Path Found → ${result.best}` : `⚠️ Best Achievable: ${result.best}`)
    .setTimestamp();

  // Clone summary
  const sortedClones = [...clones].sort((a,b) => scoreGene(b,target) - scoreGene(a,target));
  const cloneSummary = sortedClones.slice(0, 10).map(g => {
    const sc = scoreGene(g, target);
    const [lbl] = [qualityLabel(sc)];
    return `${geneBar(g)} \`${g}\` ${lbl}`;
  }).join('\n');

  embed.addFields({
    name: `📋 Your Clones (${clones.length})`,
    value: cloneSummary + (clones.length > 10 ? `\n*...and ${clones.length - 10} more*` : ''),
  });

  if (result.found && result.steps.length === 0) {
    embed.setDescription('✅ **You already have a god clone!** Just clone it and fill your planters. Place 2× copies in opposing corners to replicate perfectly.');
  } else if (result.steps.length > 0) {
    const stepLines = result.steps.map((step, i) => {
      const parents = step.extra
        ? `\`${step.a}\` × \`${step.b}\` × \`${step.extra}\``
        : `\`${step.a}\` × \`${step.b}\``;
      const resultBar = geneBar(step.result);
      const sc = scoreGene(step.result, target);
      const isLast = i === result.steps.length - 1;
      const label = isLast && result.found ? '🏆 **GOD CLONE**' : qualityLabel(sc);
      return `**Step ${i+1}:** ${parents}\n→ ${resultBar} \`${step.result}\` ${label}`;
    }).join('\n\n');

    embed.addFields({
      name: `🧬 Breeding Path — ${result.steps.length} Step${result.steps.length !== 1 ? 's' : ''}`,
      value: stepLines.slice(0, 1024),
    });

    if (result.found) {
      embed.addFields({
        name: '✅ Done!',
        value: `Clone **${result.best}** and fill your planters. Any arrangement of the same genes counts — gene order doesn't matter.`,
      });
    }
  }

  if (!result.found) {
    const sc = scoreGene(result.best, target);
    embed.addFields({
      name: '💡 How to Improve',
      value: `Best you can reach is \`${result.best}\` (${sc}/6).\n\nTo go further, find seeds with **G** or **Y** in the slots currently stuck on W or X. Remember: you need **3 plants with the same good gene** to outvote 1 red gene in a planter (3×1=3 weight > 1×2=2 weight).`,
    });
  }

  embed.setFooter({ text: `Target: ${target}  |  Gene order doesn't matter  |  🟩G 🟨Y 🟦H 🟥W ⬛X` });

  if (invalid.length > 0) {
    embed.addFields({
      name: '⚠️ Skipped (invalid)',
      value: invalid.join(', '),
    });
  }

  await interaction.editReply({ embeds: [embed] });
}
