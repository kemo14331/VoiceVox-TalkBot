import { MessageOptions } from 'discord.js';

/**
 * Botメッセージの汎用テンプレート
 */
export class BotMessage {
    /**
     * 汎用エラーメッセージ
     *
     * @param {string} content 表示する文字列
     * @return {MessageOptions}
     */
    static error(content: string): MessageOptions {
        return {
            embeds: [{ color: 'RED', title: '❌ Error', description: content }],
        };
    }

    /**
     * 汎用情報メッセージ
     *
     * @param {string} content 表示する文字列
     * @return {MessageOptions}
     */
    static info(content: string): MessageOptions {
        return {
            embeds: [{ color: 'AQUA', title: '✅ Info', description: content }],
        };
    }
}
