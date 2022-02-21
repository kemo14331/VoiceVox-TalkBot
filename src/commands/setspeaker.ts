import { BaseCommandInteraction } from 'discord.js';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { IMAIN_PROVIDER } from '../types/IMainProvider';

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
        ],
    },

    // eslint-disable-next-line no-unused-vars
    run: (interaction: BaseCommandInteraction, mainProvider: IMAIN_PROVIDER) => {
        interaction.reply('pong!');
    },
};
