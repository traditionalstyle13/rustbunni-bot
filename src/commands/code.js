import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('code')
  .setDescription('Code lock raiding mechanics — attempt limits, lockout timers, damage info');

export async function execute(interaction) {
  const embed = new EmbedBuilder()
    .setColor(0x7ec8c8)
    .setTitle('🔒 Code Lock Raiding Mechanics')
    .setDescription('Updated December 2021 patch — the 3-attempt myth is dead.')
    .addFields(
      {
        name: '⚠️ Attempt Limit',
        value: '**8 wrong attempts** triggers a **15-minute lockout**.\nAfter lockout resets, you have another 8 attempts.',
      },
      {
        name: '💥 Damage Per Attempt',
        value: 'Each wrong code deals damage to the lock:\n• Starts at **5 HP**\n• Increases **+5 HP per attempt** (5, 10, 15, 20...)\n• Damage **resets every 10 seconds** of no attempts\n\nAt attempt 8: ~40 HP total if rapid-fired',
      },
      {
        name: '📊 Code Space',
        value: '**10,000** possible codes (0000–9999)\nAt 8 attempts per 15 min window:\n~80 codes/hour maximum rate',
      },
      {
        name: '🧠 Common Codes First',
        value: 'People use predictable codes — try these first:\n`1234` `0000` `1111` `2222` `6969` `4200` `1337` `0420` `2580` `1234` `9999` `1212` `1122`',
      },
      {
        name: '💡 Tip',
        value: 'Use the **Code Raider** tool on the website for a full systematic tracker with automatic lockout countdown.',
      },
    )
    .setFooter({ text: 'Source: Corrosion Hour / Dec 2021 patch notes' })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}
