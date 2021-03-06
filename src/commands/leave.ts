import { CommandExecuteOptions, CommandObject } from '../models/CommandModel';
import { DataManager } from '../SettingsManager';
import { Logger } from '../utils/Logger';
import { CommandReply } from '../utils/messages/CommandReply';

module.exports = async (): Promise<CommandObject> => {
    return {
        data: {
            name: 'leave',
            description: 'Botをボイスチャンネルから退出させる',
        },
        execute: async (options: CommandExecuteOptions) => {
            if (options.interaction.guild) {
                if (options.interaction.guild.me?.voice.channel) {
                    const session = options.mainProvider.sessionManager.sessions.find(
                        (session) => session.guild.id === options.interaction.guild?.id
                    );
                    if (session) {
                        options.mainProvider.sessionManager.delete(session);
                        DataManager.save(options.interaction.guild.id, session.settings);
                        await options.interaction.reply(
                            CommandReply.info(
                                `${options.interaction.guild.me.voice.channel.toString()} から切断しました。`
                            )
                        );
                    } else {
                        Logger.warn('An unknown session was detected.');
                    }
                } else {
                    await options.interaction.reply(CommandReply.error('ボイスチャンネルに接続していません。', true));
                }
            } else {
                await options.interaction.reply(CommandReply.error('このコマンドはサーバー専用です。', true));
            }
        },
    };
};
