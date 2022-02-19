import { joinVoiceChannel } from '@discordjs/voice';
import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';

const data: ApplicationCommandDataResolvable = {
    name: 'summon',
    description: 'botをボイスチャンネルに呼び出す',
};
async function run(interaction: BaseCommandInteraction) {
    if (interaction.guildId && interaction.member) {
        const guild = interaction.client.guilds.cache.get(interaction.guildId);
        const member = guild?.members.cache.get(interaction.member.user.id);
        const voiceChannel = member?.voice.channel;
        if (voiceChannel && guild) {
            if (!voiceChannel.joinable) {
                interaction.reply('ボイスチャンネルに接続できません。');
                return;
            }
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });
            interaction.reply('#' + voiceChannel.name + 'に参加しました。');
        } else {
            interaction.reply('Botを呼び出すにはボイスチャンネルに参加してください。');
        }
    } else {
        interaction.reply('このコマンドはサーバー専用です。');
    }
}

export { data, run };
