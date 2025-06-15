const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('menu')
        .setDescription('Kategorilere göre rol seçim menüsünü gösterir.'),
    async execute(interaction) {
        // Sunucu adını dinamik olarak al
        const guildName = interaction.guild.name;

        // 1. Burç Rolleri Menüsü
        const burcMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('burc-roles')
                .setPlaceholder('Burç Rolü Seçin...')
                .addOptions(
                    { label: 'Koç', value: 'koc-role', emoji: '♈' },
                    { label: 'Boğa', value: 'boga-role', emoji: '♉' },
                    { label: 'İkizler', value: 'ikizler-role', emoji: '♊' },
                    { label: 'Yengeç', value: 'yengec-role', emoji: '♋' },
                    { label: 'Aslan', value: 'aslan-role', emoji: '♌' },
                    { label: 'Başak', value: 'basak-role', emoji: '♍' }
                )
        );

        // 2. İlişki Rolleri Menüsü
        const iliskiMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('iliski-roles')
                .setPlaceholder('İlişki Rolü Seçin...')
                .addOptions(
                    { label: 'Evli', value: 'evli-role', emoji: '💍' },
                    { label: 'Bekar', value: 'bekar-role', emoji: '❤️' },
                    { label: 'Aşık', value: 'asik-role', emoji: '😍' },
                    { label: 'Arkadaş Arıyor', value: 'arkadas-role', emoji: '👫' }
                )
        );

        // 3. Takım Rolleri Menüsü
        const takimMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('takim-roles')
                .setPlaceholder('Takım Rolü Seçin...')
                .addOptions(
                    { label: 'Fenerbahçe', value: 'fb-role', emoji: '🔵🟡' },
                    { label: 'Galatasaray', value: 'gs-role', emoji: '🟡🔴' },
                    { label: 'Beşiktaş', value: 'bjk-role', emoji: '⚪⚫' },
                    { label: 'Trabzonspor', value: 'ts-role', emoji: '🔵🔴' }
                )
        );

        // 4. Renk Rolleri Menüsü
        const renkMenu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('renk-roles')
                .setPlaceholder('Renk Rolü Seçin...')
                .addOptions(
                    { label: 'Mavi', value: 'mavi-role', emoji: '🔵' },
                    { label: 'Kırmızı', value: 'kirmizi-role', emoji: '🔴' },
                    { label: 'Yeşil', value: 'yesil-role', emoji: '🟢' },
                    { label: 'Sarı', value: 'sari-role', emoji: '🟡' }
                )
        );

        // Kategori Açıklama Mesajları (Her Menü İçin)
        const burcMessage = `🎉 Sevgili **${guildName}** üyeleri! Kendinize uygun **Burç** rollerini aşağıdaki menüden seçebilirsiniz.`;
        const iliskiMessage = `🎉 Sevgili **${guildName}** üyeleri! Kendinize uygun **İlişki** rollerini aşağıdaki menüden seçebilirsiniz.`;
        const takimMessage = `🎉 Sevgili **${guildName}** üyeleri! Kendinize uygun **Takım** rollerini aşağıdaki menüden seçebilirsiniz.`;
        const renkMessage = `🎉 Sevgili **${guildName}** üyeleri! Kendinize uygun **Renk** rollerini aşağıdaki menüden seçebilirsiniz.`;

        // Tüm menüleri tek mesajda gönder
        await interaction.reply({ content: burcMessage, components: [burcMenu], ephemeral: false });
        await interaction.followUp({ content: iliskiMessage, components: [iliskiMenu], ephemeral: false });
        await interaction.followUp({ content: takimMessage, components: [takimMenu], ephemeral: false });
        await interaction.followUp({ content: renkMessage, components: [renkMenu], ephemeral: false });
    }
};