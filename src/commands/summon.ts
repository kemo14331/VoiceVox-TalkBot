import { joinVoiceChannel } from '@discordjs/voice';
import { CommandExecuteOptions, CommandObject } from '../models/CommandModel';
import { DataManager } from '../SettingsManager';
import { CommandReply } from '../utils/messages/CommandReply';

module.exports = async (): Promise<CommandObject> => {
    return {
        data: {
            name: 'summon',
            description: 'Botをボイスチャンネルに呼び出す',
        },
        execute: async (options: CommandExecuteOptions) => {
            if (options.interaction.guildId && options.interaction.member) {
                const guild = options.interaction.client.guilds.cache.get(options.interaction.guildId);
                const member = guild?.members.cache.get(options.interaction.member.user.id);
                const voiceChannel = member?.voice.channel;
                if (!options.interaction.channel?.isText) {
                    return;
                }
                if (voiceChannel && guild) {
                    if (guild.me?.voice.channel) {
                        await options.interaction.reply(
                            CommandReply.error(`既に${voiceChannel.toString()} に参加しています。`, true)
                        );
                        return;
                    }
                    if (!voiceChannel.joinable) {
                        await options.interaction.reply(CommandReply.error('ボイスチャンネルに接続できません。', true));
                        return;
                    }
                    const connection = joinVoiceChannel({
                        channelId: voiceChannel.id,
                        guildId: guild.id,
                        adapterCreator: guild.voiceAdapterCreator,
                    });
                    options.mainProvider.sessionManager.register({
                        guild: guild,
                        textChannel: options.interaction.channel,
                        voiceChannel: voiceChannel,
                        voiceConnection: connection,
                        settings: DataManager.load(guild.id),
                    });
                    await options.interaction.reply(
                        CommandReply.info(
                            `${voiceChannel.toString()} に参加しました。\n\`/speaker set\`で読み上げに使用する音声モデルを変更できます。`
                        )
                    );
                } else {
                    await options.interaction.reply(
                        CommandReply.error('Botを呼び出すにはボイスチャンネルに参加してください。', true)
                    );
                }
            } else {
                await options.interaction.reply(CommandReply.error('このコマンドはサーバー専用です。', true));
            }
        },
    };
};
