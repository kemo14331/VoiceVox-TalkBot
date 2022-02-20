import { joinVoiceChannel } from '@discordjs/voice';
import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';
import { SessionProvider } from '../providers/SessionProvider';
import { CommandReply } from '../util.ts/CommandReply';

const data: ApplicationCommandDataResolvable = {
    name: 'summon',
    description: 'Botをボイスチャンネルに呼び出す',
};
async function run(interaction: BaseCommandInteraction, sessionProvider: SessionProvider) {
    if (interaction.guildId && interaction.member) {
        const guild = interaction.client.guilds.cache.get(interaction.guildId);
        const member = guild?.members.cache.get(interaction.member.user.id);
        const voiceChannel = member?.voice.channel;
        if (!interaction.channel?.isText) {
            return;
        }
        if (voiceChannel && guild) {
            if (guild.me?.voice.channel) {
                interaction.reply(CommandReply.error(`既に${voiceChannel.toString()} に参加しています。`, true));
                return;
            }
            if (!voiceChannel.joinable) {
                interaction.reply(CommandReply.error('ボイスチャンネルに接続できません。', true));
                return;
            }
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });
            sessionProvider.sessions.push({
                guild: guild,
                textChannel: interaction.channel,
                voiceChannel: voiceChannel,
            });
            interaction.reply(CommandReply.info(`${voiceChannel.toString()} に参加しました。`));
        } else {
            interaction.reply(CommandReply.error('Botを呼び出すにはボイスチャンネルに参加してください。', true));
        }
    } else {
        interaction.reply(CommandReply.error('このコマンドはサーバー専用です。', true));
    }
}

export { data, run };
