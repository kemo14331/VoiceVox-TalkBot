import { CommandExecuteOptions, CommandObject } from '../types/CommandTypes';
import { CommandReply } from '../util/CommandReply';

module.exports = async (): Promise<CommandObject> => {
    return {
        data: {
            name: 'leave',
            description: 'botをボイスチャンネルから退出させる',
        },
        execute: (options: CommandExecuteOptions) => {
            if (options.interaction.guild) {
                if (options.interaction.guild.me?.voice.channel) {
                    options.interaction.guild.me?.voice.disconnect();
                    options.interaction.reply(
                        CommandReply.info(`${options.interaction.guild.me.voice.channel.toString()} から切断しました。`)
                    );
                } else {
                    options.interaction.reply(CommandReply.error('ボイスチャンネルに接続していません。', true));
                }
            } else {
                options.interaction.reply(CommandReply.error('このコマンドはサーバー専用です。', true));
            }
        },
    };
};
