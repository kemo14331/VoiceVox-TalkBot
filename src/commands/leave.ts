import { BaseCommandInteraction } from 'discord.js';
import { MainProvider } from '../providers/MainProvider';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { CommandReply } from '../util/CommandReply';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'leave',
        description: 'botをボイスチャンネルから退出させる',
    },
    // eslint-disable-next-line no-unused-vars
    run: (interaction: BaseCommandInteraction, mainProvider: MainProvider) => {
        if (interaction.guild) {
            if (interaction.guild.me?.voice.channel) {
                interaction.guild.me?.voice.disconnect();
                interaction.reply(
                    CommandReply.info(`${interaction.guild.me.voice.channel.toString()} から切断しました。`)
                );
            } else {
                interaction.reply(CommandReply.error('ボイスチャンネルに接続していません。', true));
            }
        } else {
            interaction.reply(CommandReply.error('このコマンドはサーバー専用です。', true));
        }
    },
};
