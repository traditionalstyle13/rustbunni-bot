import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('All Bunni Bot commands and how to use them');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor(0xd4718a)
    .setTitle('🐰 Bunni\'s Eco Raid Emporium — Bot Commands')
    .setDescription('All the tools from the site, now in Discord.')
    .addFields(
      {
        name: '💣 `/raid <target> [qty]`',
        value: 'All explosive raid methods for a target with sulfur costs.\nExample: `/raid target:stone-wall qty:3`',
      },
      {
        name: '🌿 `/ecoraid <target> [players] [qty]`',
        value: 'Eco methods — melee tools, handmade shells, molotovs. Splits quantities across players.\nExample: `/ecoraid target:wood-wall players:4`',
      },
      {
        name: '🔥 `/sulfur <item> <qty>`',
        value: 'Sulfur, gunpowder and charcoal needed to craft any quantity of raid items.\nExample: `/sulfur item:rocket qty:10`',
      },
      {
        name: '🧬 `/breed <clones> [target]`',
        value: 'Paste your clone genes and get a step-by-step path to a god clone (3G+3Y in any order).\nExample: `/breed clones:GGYYWX GGWYYY GYGYYY`',
      },
      {
        name: '⏳ `/decay <tier> <hp> [coords]`',
        value: 'Start a decay timer — bot DMs you 5 mins before and when it\'s gone. Optionally add coords.\nExample: `/decay tier:stone hp:347 coords:G14`',
      },
      {
        name: '📋 `/decaylist`',
        value: 'See all your active decay timers with time remaining.',
      },
      {
        name: '❌ `/decaycancel <id>`',
        value: 'Cancel a running decay timer by its ID.\nExample: `/decaycancel id:3`',
      },
      {
        name: '❓ `/help`',
        value: 'This message.',
      },
    )
    .addFields({
      name: '🌐 Full Site',
      value: 'For circuit diagrams, Code Raider tracker, farming guides and more:\n**bunni.hobohost.com** *(or wherever you upload the site)*',
    })
    .setFooter({ text: '🐰 Bunni\'s Eco Raid Emporium' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed], ephemeral: true });
}
