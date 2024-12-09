const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Fetch user information from Heliactyl")
    .addStringOption(option =>
      option.setName("user_id")
        .setDescription("The user's ID to fetch information for")
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.options.getString("user_id");
    db.get("SELECT url FROM users WHERE user_id = ?", [interaction.user.id], async (err, row) => {
      if (err || !row) {
        return interaction.reply({ content: "You have not configured your URL. Use /configuration to set it.", ephemeral: true });
      }

      const url = `${row.url}/api/v2/userinfo?id=${userId}`;
      try {
        const response = await axios.get(url);
        if (response.data.status === "success") {
          interaction.reply({ content: `User Info: ${JSON.stringify(response.data)}`, ephemeral: true });
        } else {
          interaction.reply({ content: `Error: ${response.data.status}`, ephemeral: true });
        }
      } catch {
        interaction.reply({ content: "Failed to connect to Heliactyl API.", ephemeral: true });
      }
    });
  }
};
