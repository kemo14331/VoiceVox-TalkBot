import SampleComponent from '../components/SampleComponent';
import { CommandExecuteOptions, CommandObject } from '../models/CommandModel';

module.exports = async (): Promise<CommandObject> => {
    return {
        data: {
            name: 'componenttest',
            description: 'コンポーネントのテスト',
        },
        execute: async (options: CommandExecuteOptions) => {
            await options.interaction.reply({
                components: [
                    await SampleComponent.view({
                        choices: [
                            { label: '選択肢1', value: '選択肢1' },
                            { label: '選択肢2', value: '選択肢2' },
                            { label: '選択肢3', value: '選択肢3' },
                        ],
                    }),
                ],
            });
        },
    };
};
