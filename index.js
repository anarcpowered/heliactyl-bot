const fs = require("fs");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const { token, adminRole } = require("./config.json");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  // Check for admin role
  if (!interaction.member.permissions.has("Administrator")) {
  return interaction.reply({ content: "You must be a server admin to use this command.", ephemeral: true });
}


  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: "There was an error executing this command.", ephemeral: true });
  }
});

client.login(token);
