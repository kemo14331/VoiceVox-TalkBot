import { CommandExecuteOptions, ICOMMAND_OBJECT } from '../types/ICommandTypes';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'setspeaker',
        description: '読み上げに使用する音声モデルを設定する',
        options: [
            {
                type: 'NUMBER',
                name: 'speaker',
                description: '音声モデル',
                required: true,
                choices: [
                    { name: '四国めたん', value: 1 },
                    { name: 'ずんだもん', value: 2 },
                    { name: '春日部つむぎ', value: 3 },
                    { name: '雨晴はう', value: 4 },
                    { name: '波音リツ', value: 5 },
                ],
            },
            {
                type: 'NUMBER',
                name: 'style',
                description: 'スタイル',
                required: false,
                choices: [
                    { name: 'ノーマル', value: 1 },
                    { name: 'あまあま', value: 2 },
                    { name: 'ツンツン', value: 3 },
                    { name: 'セクシー', value: 4 },
                ],
            },
        ],
    },

    execute: (options: CommandExecuteOptions) => {
        options.interaction.reply('pong!');
        //new MessageButton({})
    },
};
