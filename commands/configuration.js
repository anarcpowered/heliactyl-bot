const { SlashCommandBuilder } = require("discord.js");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("configuration")
    .setDescription("Link your Heliactyl URL")
    .addStringOption(option =>
      option.setName("url")
        .setDescription("Your unique Heliactyl URL")
        .setRequired(true)
    ),
  async execute(interaction) {
    const url = interaction.options.getString("url");
    db.run(
      "INSERT OR REPLACE INTO users (user_id, url) VALUES (?, ?)",
      [interaction.user.id, url],
      err => {
        if (err) {
          return interaction.reply({ content: "Failed to save URL.", ephemeral: true });
        }
        interaction.reply({ content: `Your URL has been set to: ${url}`, ephemeral: true });
      }
    );
  }
};
