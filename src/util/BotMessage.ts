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
            embeds: [{ color: 'RED', description: content }],
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
            embeds: [{ color: 'AQUA', description: content }],
        };
    }

    /**
     * 汎用成功メッセージ
     *
     * @param {string} content 表示する文字列
     * @return {MessageOptions}
     */
    static success(content: string): MessageOptions {
        return {
            embeds: [{ color: 'GREEN', description: content }],
        };
    }
}
