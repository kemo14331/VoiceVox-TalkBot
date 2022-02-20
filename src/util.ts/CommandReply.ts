import { InteractionReplyOptions } from 'discord.js';

export class CommandReply {
    static error(content: string, ephemeral: boolean = false): InteractionReplyOptions {
        return {
            embeds: [{ color: 'RED', description: content }],
            ephemeral: ephemeral,
        };
    }

    static info(content: string, ephemeral: boolean = false): InteractionReplyOptions {
        return {
            embeds: [{ color: 'AQUA', description: content }],
            ephemeral: ephemeral,
        };
    }
}
