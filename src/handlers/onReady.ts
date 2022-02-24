import config from 'config';
import { ApplicationCommandDataResolvable, Client } from 'discord.js';
import { MainProvider } from '../models/MainProviderModel';
import { Logger } from '../utils/Logger';
import { loadCommands, registerCommands } from '../utils/registers/CommandRegister';
import { loadComponents } from '../utils/registers/ComponentResister';
import { VoiceVoxEngine } from '../VoiceVoxEngine';

/**
 * クライアント接続完了時に呼ばれる
 *
 * @param {Client} client
 * @param {MainProvider} mainProvider
 */
export async function onReady(client: Client, mainProvider: MainProvider) {
    mainProvider.commands = await loadCommands();
    Logger.info(`Loaded ${mainProvider.commands.length} commands.`);
    mainProvider.components = await loadComponents();
    Logger.info(`Loaded ${mainProvider.components.length} components.`);
    const datas: Array<ApplicationCommandDataResolvable> = mainProvider.commands.map((command) => command.data);
    await registerCommands({ client: client, datas: datas, guildId: config.get('bot.ownerGuild') });
    await registerCommands({ client: client, datas: datas });
    for (const guild of client.guilds.cache) {
        if (guild[1].me?.voice.channel) {
            guild[1].me.voice.disconnect();
        }
    }
    Logger.info(`Logged in as ${client.user?.tag}.`);
    if (await VoiceVoxEngine.isReady()) {
        Logger.info(`VoiceVox-Engine is ready: v${await VoiceVoxEngine.getVersion()}`);
    } else {
        Logger.warn('VoiceVox-Engine is not ready.');
    }
}
