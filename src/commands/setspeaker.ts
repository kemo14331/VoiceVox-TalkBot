import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';
import { MainProvider } from '../providers/MainProvider';

const data: ApplicationCommandData = {
    name: 'setspeaker',
    description: '読み上げに使用する音声モデルを設定する',
    options: [
        {
            type: 'NUMBER',
            name: 'speaker',
            description: '音声モデル',
            choices: [
                { name: '四国めたん', value: 1 },
                { name: 'ずんだもん', value: 2 },
                { name: '春日部つむぎ', value: 3 },
                { name: '雨晴はう', value: 4 },
                { name: '波音リツ', value: 5 },
            ],
        },
    ],
};

// eslint-disable-next-line no-unused-vars
async function run(interaction: BaseCommandInteraction, mainProvider: MainProvider) {
    interaction.reply('pong!');
}

export { data, run };
