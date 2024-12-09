const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setplan")
    .setDescription("Set a package plan for a user in Heliactyl")
    .addStringOption(option =>
      option.setName("user_id")
        .setDescription("The user's ID")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("package")
        .setDescription("The package name to set (leave blank to remove)")
        .setRequired(false)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({ content: "You must be a server admin to use this command.", ephemeral: true });
    }

    const userId = interaction.options.getString("user_id");
    const packageName = interaction.options.getString("package") || null;

    db.get("SELECT url FROM users WHERE user_id = ?", [interaction.user.id], async (err, row) => {
      if (err || !row) {
        return interaction.reply({ content: "You have not configured your URL. Use /configuration to set it.", ephemeral: true });
      }

      const url = `${row.url}/api/v2/setplan`;
      try {
        const response = await axios.post(url, { id: userId, package: packageName });
        if (response.data.status === "success") {
          interaction.reply({
            content: packageName
              ? `Successfully set package "${packageName}" for user ID ${userId}.`
              : `Successfully removed package for user ID ${userId}.`,
            ephemeral: true,
          });
        } else {
          interaction.reply({ content: `Error: ${response.data.status}`, ephemeral: true });
        }
      } catch {
        interaction.reply({ content: "Failed to connect to Heliactyl API.", ephemeral: true });
      }
    });
  }
};
