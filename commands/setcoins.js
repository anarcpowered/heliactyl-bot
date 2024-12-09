const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setcoins")
    .setDescription("Set coins for a user in Heliactyl")
    .addStringOption(option =>
      option.setName("user_id")
        .setDescription("The user's ID")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("coins")
        .setDescription("The number of coins to set")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({ content: "You must be a server admin to use this command.", ephemeral: true });
    }

    const userId = interaction.options.getString("user_id");
    const coins = interaction.options.getInteger("coins");

    db.get("SELECT url FROM users WHERE user_id = ?", [interaction.user.id], async (err, row) => {
      if (err || !row) {
        return interaction.reply({ content: "You have not configured your URL. Use /configuration to set it.", ephemeral: true });
      }

      const url = `${row.url}/api/v2/setcoins`;
      try {
        const response = await axios.post(url, { id: userId, coins });
        if (response.data.status === "success") {
          interaction.reply({ content: `Successfully set ${coins} coins for user ID ${userId}.`, ephemeral: true });
        } else {
          interaction.reply({ content: `Error: ${response.data.status}`, ephemeral: true });
        }
      } catch {
        interaction.reply({ content: "Failed to connect to Heliactyl API.", ephemeral: true });
      }
    });
  }
};
