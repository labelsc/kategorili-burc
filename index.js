const { Client, GatewayIntentBits, Partials, Events, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const config = require('./config.json');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
  partials: [Partials.GuildMember]
});

// Kategoriler, roller ve emojiler burada:
const roleData = {
  burc: {
    name: 'Burçlar',
    emoji: '♈',
    options: [
      { label: 'Koç', value: 'Koç', description: 'Koç burcu rolü', emoji: '♈' },
      { label: 'Boğa', value: 'Boğa', description: 'Boğa burcu rolü', emoji: '♉' },
      { label: 'İkizler', value: 'İkizler', description: 'İkizler burcu rolü', emoji: '♊' },
      { label: 'Yengeç', value: 'Yengeç', description: 'Yengeç burcu rolü', emoji: '♋' },
      { label: 'Aslan', value: 'Aslan', description: 'Aslan burcu rolü', emoji: '♌' },
      { label: 'Başak', value: 'Başak', description: 'Başak burcu rolü', emoji: '♍' },
      { label: 'Terazi', value: 'Terazi', description: 'Terazi burcu rolü', emoji: '♎' },
      { label: 'Akrep', value: 'Akrep', description: 'Akrep burcu rolü', emoji: '♏' },
      { label: 'Yay', value: 'Yay', description: 'Yay burcu rolü', emoji: '♐' },
      { label: 'Oğlak', value: 'Oğlak', description: 'Oğlak burcu rolü', emoji: '♑' },
      { label: 'Kova', value: 'Kova', description: 'Kova burcu rolü', emoji: '♒' },
      { label: 'Balık', value: 'Balık', description: 'Balık burcu rolü', emoji: '♓' },
      { label: '❌ Temizle', value: 'temizle_burc', description: 'Burç rolünü temizle', emoji: '❌' }
    ]
  },
  iliski: {
    name: 'İlişki Durumu',
    emoji: '❤️',
    options: [
      { label: 'Bekar', value: 'Bekar', description: 'Bekar rolü', emoji: '❤️' },
      { label: 'Sevgili', value: 'Sevgili', description: 'Sevgili rolü', emoji: '💖' },
      { label: 'Nişanlı', value: 'Nişanlı', description: 'Nişanlı rolü', emoji: '💍' },
      { label: 'Evli', value: 'Evli', description: 'Evli rolü', emoji: '💒' },
      { label: '❌ Temizle', value: 'temizle_iliski', description: 'İlişki rolünü temizle', emoji: '❌' }
    ]
  },
  renk: {
    name: 'Renkler',
    emoji: '🎨',
    options: [
      { label: 'Kırmızı', value: 'Kırmızı', description: 'Kırmızı renk rolü', emoji: '🟥' },
      { label: 'Mavi', value: 'Mavi', description: 'Mavi renk rolü', emoji: '🟦' },
      { label: 'Yeşil', value: 'Yeşil', description: 'Yeşil renk rolü', emoji: '🟩' },
      { label: 'Sarı', value: 'Sarı', description: 'Sarı renk rolü', emoji: '🟨' },
      { label: 'Mor', value: 'Mor', description: 'Mor renk rolü', emoji: '🟪' },
      { label: 'Turuncu', value: 'Turuncu', description: 'Turuncu renk rolü', emoji: '🟧' },
      { label: '❌ Temizle', value: 'temizle_renk', description: 'Renk rolünü temizle', emoji: '❌' }
    ]
  },
  takim: {
    name: 'Takımlar',
    emoji: '⚽',
    options: [
      { label: 'Fenerbahçe', value: 'Fenerbahçe', description: 'Fenerbahçe takımı rolü', emoji: '🟡' },
      { label: 'Galatasaray', value: 'Galatasaray', description: 'Galatasaray takımı rolü', emoji: '🟥' },
      { label: 'Beşiktaş', value: 'Beşiktaş', description: 'Beşiktaş takımı rolü', emoji: '⚫' },
      { label: 'Trabzonspor', value: 'Trabzonspor', description: 'Trabzonspor takımı rolü', emoji: '🟦' },
      { label: '❌ Temizle', value: 'temizle_takim', description: 'Takım rolünü temizle', emoji: '❌' }
    ]
  }
};

async function ensureRolesExist(guild) {
  console.log(`[${guild.name}] Roller kontrol ediliyor...`);
  for (const [categoryId, category] of Object.entries(roleData)) {
    for (const option of category.options) {
      if (option.value.startsWith('temizle')) continue;

      const roleName = `${category.emoji} ${option.value}`;
      let role = guild.roles.cache.find(r => r.name === roleName);

      if (!role) {
        console.log(`[${guild.name}] Rol bulunamadı, oluşturuluyor: ${roleName}`);
        role = await guild.roles.create({
          name: roleName,
          mentionable: true,
          reason: 'Kurulum komutu ile otomatik oluşturuldu.'
        });
        console.log(`[${guild.name}] Rol oluşturuldu: ${role.name}`);
      } else {
        console.log(`[${guild.name}] Rol zaten mevcut: ${role.name}`);
      }
    }
  }
  console.log(`[${guild.name}] Roller oluşturma/kontrol işlemi tamamlandı.`);
}

function createMenuRows() {
  const rows = [];
  for (const [categoryId, category] of Object.entries(roleData)) {
    const row = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId(`${categoryId}_rol`)
        .setPlaceholder(`${category.name} seçiniz`)
        .addOptions(category.options)
        .setMaxValues(1)
    );
    rows.push(row);
  }
  return rows;
}

client.once(Events.ClientReady, () => {
  console.log(`Bot hazır! Giriş yapıldı: ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === 'kurulum') {
      await interaction.deferReply({ ephemeral: true });
      try {
        await ensureRolesExist(interaction.guild);
        await interaction.editReply('Kurulum tamamlandı! Roller oluşturuldu veya zaten mevcut.');
      } catch (error) {
        console.error('Kurulum hatası:', error);
        await interaction.editReply('Kurulum sırasında hata oluştu!');
      }
    } else if (interaction.commandName === 'menu') {
      try {
        const rows = createMenuRows();
        await interaction.reply({ content: 'Rolleriniz için aşağıdaki menülerden seçim yapabilirsiniz:', components: rows, ephemeral: false });
      } catch (error) {
        console.error('Menü gönderme hatası:', error);
        await interaction.reply({ content: 'Menü gönderilirken hata oluştu!', ephemeral: true });
      }
    }
  }

  if (interaction.isStringSelectMenu()) {
    try {
      const [categoryId, suffix] = interaction.customId.split('_');
      if (suffix !== 'rol') return;

      const category = roleData[categoryId];
      if (!category) {
        await interaction.reply({ content: 'Bilinmeyen rol kategorisi!', ephemeral: true });
        return;
      }

      const selectedValue = interaction.values[0];

      if (selectedValue.startsWith('temizle')) {
        // Temizle rolü kaldır
        const clearRoleName = selectedValue.replace('temizle_', '');
        const clearRoleFullName = `${category.emoji} ${clearRoleName}`;
        const roleToRemove = interaction.guild.roles.cache.find(r => r.name === clearRoleFullName);
        if (roleToRemove && interaction.member.roles.cache.has(roleToRemove.id)) {
          await interaction.member.roles.remove(roleToRemove);
          await interaction.reply({ content: `${clearRoleFullName} rolü kaldırıldı.`, ephemeral: true });
          console.log(`[${interaction.guild.name}] ${interaction.user.tag} rol kaldırdı: ${clearRoleFullName}`);
        } else {
          await interaction.reply({ content: `Üzerinizde ${clearRoleFullName} rolü yok.`, ephemeral: true });
        }
        return;
      }

      const roleName = `${category.emoji} ${selectedValue}`;
      const role = interaction.guild.roles.cache.find(r => r.name === roleName);
      if (!role) {
        await interaction.reply({ content: 'Rol bulunamadı!', ephemeral: true });
        return;
      }

      // Aynı kategorideki diğer roller silinsin
      for (const option of category.options) {
        if (option.value.startsWith('temizle')) continue;
        const otherRoleName = `${category.emoji} ${option.value}`;
        const otherRole = interaction.guild.roles.cache.find(r => r.name === otherRoleName);
        if (otherRole && otherRole.id !== role.id && interaction.member.roles.cache.has(otherRole.id)) {
          await interaction.member.roles.remove(otherRole);
          console.log(`[${interaction.guild.name}] ${interaction.user.tag} rol kaldırdı: ${otherRoleName}`);
        }
      }

      // Yeni rol ver
      if (!interaction.member.roles.cache.has(role.id)) {
        await interaction.member.roles.add(role);
        await interaction.reply({ content: `${roleName} rolü başarıyla verildi!`, ephemeral: true });
        console.log(`[${interaction.guild.name}] ${interaction.user.tag} rol aldı: ${roleName}`);
      } else {
        await interaction.reply({ content: `Zaten bu role sahipsiniz: ${roleName}`, ephemeral: true });
      }

    } catch (error) {
      console.error('Rol seçimi hatası:', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({ content: 'Rol seçimi sırasında hata oluştu!' }).catch(() => { });
      } else {
        await interaction.reply({ content: 'Rol seçimi sırasında hata oluştu!', ephemeral: true }).catch(() => { });
      }
    }
  }
});

client.login(config.token);
