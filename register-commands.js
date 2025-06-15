// register-commands.js
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const config = require('./config.json');

const commands = [
    new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Kategorilere göre rol seçim menüsünü gösterir.'),
    new SlashCommandBuilder()
        .setName('kurulum')
        .setDescription('Rolleri kurar.')
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log('Komutlar yükleniyor...');
        await rest.put(
            Routes.applicationGuildCommands(config.clientId, config.guildId),
            { body: commands }
        );
        console.log('Komutlar başarıyla yüklendi!');
    } catch (error) {
        console.error('Komut yüklenirken hata:', error);
    }
})();