const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const { token, clientId, guildId } = require('./config.json');

const commands = [
  new SlashCommandBuilder().setName('kurulum').setDescription('Kategori bazlı rol seçim menüsünü kurar.')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Komutlar yükleniyor...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
    console.log('✅ Komutlar başarıyla yüklendi.');
  } catch (err) {
    console.error(err);
  }
})();
