import { joinVoiceChannel } from '@discordjs/voice';
import { CommandExecuteOption, ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { CommandReply } from '../util/CommandReply';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'summon',
        description: 'Botをボイスチャンネルに呼び出す',
    },
    execute: async (options: CommandExecuteOption) => {
        if (options.interaction.guildId && options.interaction.member) {
            const guild = options.interaction.client.guilds.cache.get(options.interaction.guildId);
            const member = guild?.members.cache.get(options.interaction.member.user.id);
            const voiceChannel = member?.voice.channel;
            if (!options.interaction.channel?.isText) {
                return;
            }
            if (voiceChannel && guild) {
                if (guild.me?.voice.channel) {
                    options.interaction.reply(
                        CommandReply.error(`既に${voiceChannel.toString()} に参加しています。`, true)
                    );
                    return;
                }
                if (!voiceChannel.joinable) {
                    options.interaction.reply(CommandReply.error('ボイスチャンネルに接続できません。', true));
                    return;
                }
                let connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                });
                options.mainProvider.sessions.push({
                    guild: guild,
                    textChannel: options.interaction.channel,
                    voiceChannel: voiceChannel,
                    voiceConnection: connection,
                });
                options.interaction.reply(CommandReply.info(`${voiceChannel.toString()} に参加しました。`));
            } else {
                options.interaction.reply(
                    CommandReply.error('Botを呼び出すにはボイスチャンネルに参加してください。', true)
                );
            }
        } else {
            options.interaction.reply(CommandReply.error('このコマンドはサーバー専用です。', true));
        }
    },
};
