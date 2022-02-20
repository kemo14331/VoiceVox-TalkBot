import { InteractionReplyOptions } from 'discord.js';

export class CommandReply {
    static error(content: string, ephemeral: boolean = false): InteractionReplyOptions {
        return {
            embeds: [{ color: 'RED', title: '❌ Error', description: content }],
            ephemeral: ephemeral,
        };
    }

    static info(content: string, ephemeral: boolean = false): InteractionReplyOptions {
        return {
            embeds: [{ color: 'AQUA', title: '✅ Info', description: content }],
            ephemeral: ephemeral,
        };
    }
}
