import { MessageActionRow, MessageSelectMenu, SelectMenuInteraction } from 'discord.js';
import { MessageActionComponent, MessageActionComponentExecuteOptions } from '../types/MessageActionComponentTypes';
import { CommandReply } from '../util/CommandReply';

const id = 'sampleComponent';

type SampleComponentModel = {
    choices: {
        label: string;
        value: string;
    }[];
};

interface SampleComponent extends MessageActionComponent {
    view: (options: SampleComponentModel) => Promise<MessageActionRow>;
}

export default {
    id: id,
    view: async (options: SampleComponentModel): Promise<MessageActionRow> => {
        const component = new MessageActionRow({
            components: [
                new MessageSelectMenu({
                    custom_id: id,
                    placeholder: '選択してください',
                    options: options.choices,
                }),
            ],
        });
        return component;
    },
    execute: async (options: MessageActionComponentExecuteOptions) => {
        const value = (options.interaction as SelectMenuInteraction).values[0];
        options.interaction.reply(CommandReply.info(`\`${value}\`が選択されました`, true));
    },
} as SampleComponent;
