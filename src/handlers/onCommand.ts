import { Client, CommandInteraction } from 'discord.js';
import { MainProvider } from '../models/MainProviderModel';
import { Logger } from '../utils/Logger';

/**
 * スラッシュコマンドが実行されたとき呼ばれる
 *
 * @param {Client} client
 * @param {CommandInteraction} interaction
 * @param {MainProvider} mainProvider
 */
export async function onCommand(client: Client, interaction: CommandInteraction, mainProvider: MainProvider) {
    for (const command of mainProvider.commands) {
        if (command.data.name === (interaction as CommandInteraction).commandName) {
            try {
                await command.execute({
                    interaction: interaction,
                    mainProvider: mainProvider,
                });
            } catch (e) {
                Logger.error(`Faild to execute command: ${command.data.name}`);
                Logger.trace(String(e));
            }
        }
    }
}
