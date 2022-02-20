import { InteractionReplyOptions } from 'discord.js';
import { BotMessage } from './BotMessage';

export class CommandReply {
    static error(content: string, ephemeral: boolean = false): InteractionReplyOptions {
        return {
            embeds: BotMessage.error(content).embeds,
            ephemeral: ephemeral,
        };
    }

    static info(content: string, ephemeral: boolean = false): InteractionReplyOptions {
        return {
            embeds: BotMessage.info(content).embeds,
            ephemeral: ephemeral,
        };
    }
}
