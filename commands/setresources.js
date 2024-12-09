const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const db = require("../database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setresources")
    .setDescription("Set resources (RAM, disk, CPU, servers) for a user in Heliactyl")
    .addStringOption(option =>
      option.setName("user_id")
        .setDescription("The user's ID")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("ram")
        .setDescription("Amount of RAM to set (in MB)")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("disk")
        .setDescription("Amount of disk space to set (in MB)")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("cpu")
        .setDescription("Amount of CPU to set (in %)")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("servers")
        .setDescription("Number of servers to set")
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has("Administrator")) {
      return interaction.reply({ content: "You must be a server admin to use this command.", ephemeral: true });
    }

    const userId = interaction.options.getString("user_id");
    const ram = interaction.options.getInteger("ram");
    const disk = interaction.options.getInteger("disk");
    const cpu = interaction.options.getInteger("cpu");
    const servers = interaction.options.getInteger("servers");

    db.get("SELECT url FROM users WHERE user_id = ?", [interaction.user.id], async (err, row) => {
      if (err || !row) {
        return interaction.reply({ content: "You have not configured your URL. Use /configuration to set it.", ephemeral: true });
      }

      const url = `${row.url}/api/v2/setresources`;
      try {
        const response = await axios.post(url, { id: userId, ram, disk, cpu, servers });
        if (response.data.status === "success") {
          interaction.reply({ content: `Successfully set resources for user ID ${userId}.`, ephemeral: true });
        } else {
          interaction.reply({ content: `Error: ${response.data.status}`, ephemeral: true });
        }
      } catch {
        interaction.reply({ content: "Failed to connect to Heliactyl API.", ephemeral: true });
      }
    });
  }
};
