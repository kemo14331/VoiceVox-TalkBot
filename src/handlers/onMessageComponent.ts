import { Client, MessageComponentInteraction } from 'discord.js';
import { MainProvider } from '../models/MainProviderModel';
import { Logger } from '../utils/Logger';

/**
 * スラッシュコマンドが実行されたとき呼ばれる
 *
 * @param {Client} client
 * @param {MessageComponentInteraction} interaction
 * @param {MainProvider} mainProvider
 */
export async function onMessageComponent(
    client: Client,
    interaction: MessageComponentInteraction,
    mainProvider: MainProvider
) {
    for (const component of mainProvider.components) {
        if (component.id === (interaction as MessageComponentInteraction).customId) {
            try {
                await component.execute({ interaction: interaction, mainProvider: mainProvider });
            } catch (e) {
                Logger.error(`Faild to execute command: ${component.id}`);
                Logger.trace(String(e));
            }
        }
    }
}
