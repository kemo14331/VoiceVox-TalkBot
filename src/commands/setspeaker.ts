import { CommandExecuteOptions, ICOMMAND_OBJECT } from '../types/ICommandTypes';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'setspeaker',
        description: '読み上げに使用する音声モデルを設定する',
    },

    execute: async (options: CommandExecuteOptions) => {
        options.interaction.reply('pong!');
        //new MessageButton({})
    },
};
