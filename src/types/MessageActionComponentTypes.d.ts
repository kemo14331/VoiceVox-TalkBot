import { MessageActionRow, MessageComponentInteraction } from 'discord.js';

type MessageActionComponentExecuteOptions = {
    interaction: MessageComponentInteraction;
    mainProvider: MainProvider;
};

export interface MessageActionComponent {
    id: string;
    view: (options) => Promise<MessageActionRow>;
    execute: (options: MessageActionComponentExecuteOptions) => any;
}
