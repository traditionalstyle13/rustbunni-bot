import { Client, GatewayIntentBits, REST, Routes, Collection } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Only Guilds intent needed - DMs work via users.fetch without GuildMembers
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ]
});
client.commands = new Collection();

// Load commands
const commandFiles = readdirSync(join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
const commandsData = [];

for (const file of commandFiles) {
  const mod = await import(pathToFileURL(join(__dirname, 'commands', file)).href);
  client.commands.set(mod.data.name, mod);
  commandsData.push(mod.data.toJSON());
}

// Register slash commands
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
try {
  console.log('Registering slash commands...');
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commandsData }
  );
  console.log('Slash commands registered.');
} catch (err) {
  console.error('Failed to register commands:', err);
}

client.once('clientReady', () => {
  console.log(`✅ Bunni Bot online as ${client.user.tag}`);
  client.user.setActivity('🌱 Farming God Clones', { type: 4 });
});

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (err) {
      console.error(err);
      const msg = { content: '❌ Something went wrong running that command.', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
  }

  if (interaction.isAutocomplete()) {
    const cmd = client.commands.get(interaction.commandName);
    if (cmd?.autocomplete) {
      try { await cmd.autocomplete(interaction); } catch {}
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
