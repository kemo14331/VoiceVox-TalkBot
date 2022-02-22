import { InteractionReplyOptions } from 'discord.js';
import { BotMessage } from './BotMessage';

/**
 * コマンド返信メッセージの汎用テンプレート
 */
export class CommandReply {
    /**
     * 汎用エラーメッセージ
     *
     * @param {string} content 表示する文字列
     * @param {boolean} ephemeral
     * @return {MessageOptions}
     */
    static error(content: string, ephemeral: boolean = false): InteractionReplyOptions {
        return {
            embeds: BotMessage.error(content).embeds,
            ephemeral: ephemeral,
        };
    }

    /**
     * 汎用情報メッセージ
     *
     * @param {string} content 表示する文字列
     * @param {boolean} ephemeral
     * @return {MessageOptions}
     */
    static info(content: string, ephemeral: boolean = false): InteractionReplyOptions {
        return {
            embeds: BotMessage.info(content).embeds,
            ephemeral: ephemeral,
        };
    }
}
