import { joinVoiceChannel } from '@discordjs/voice';
import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';

const data: ApplicationCommandDataResolvable = {
    name: 'summon',
    description: 'Botをボイスチャンネルに呼び出す',
};
async function run(interaction: BaseCommandInteraction) {
    if (interaction.guildId && interaction.member) {
        const guild = interaction.client.guilds.cache.get(interaction.guildId);
        const member = guild?.members.cache.get(interaction.member.user.id);
        const voiceChannel = member?.voice.channel;
        if (voiceChannel && guild) {
            if (guild.me?.voice.channel) {
                interaction.reply({ content: `既に${voiceChannel.toString()} に参加しています。`, ephemeral: true });
                return;
            }
            if (!voiceChannel.joinable) {
                interaction.reply({ content: 'ボイスチャンネルに接続できません。', ephemeral: true });
                return;
            }
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });
            interaction.reply(`${voiceChannel.toString()} に参加しました。`);
        } else {
            interaction.reply({ content: 'Botを呼び出すにはボイスチャンネルに参加してください。', ephemeral: true });
        }
    } else {
        interaction.reply('このコマンドはサーバー専用です。');
    }
}

export { data, run };
