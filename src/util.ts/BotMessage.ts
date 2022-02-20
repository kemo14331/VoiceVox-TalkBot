import { MessageOptions } from 'discord.js';

export class BotMessage {
    static error(content: string): MessageOptions {
        return {
            embeds: [{ color: 'RED', title: '❌ Error', description: content }],
        };
    }

    static info(content: string): MessageOptions {
        return {
            embeds: [{ color: 'AQUA', title: '✅ Info', description: content }],
        };
    }
}
