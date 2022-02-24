import config from 'config';
import { Client } from 'discord.js';
import dotenv from 'dotenv';
import { onCommand } from './handlers/onCommand';
import { onMessageComponent } from './handlers/onMessageComponent';
import { onMessageCreate } from './handlers/onMessageCreate';
import { onReady } from './handlers/onReady';
import { onVoiceStateUpdate } from './handlers/onVoiceStateUpdate';
import { MainProvider } from './models/MainProviderModel';
import { SessionManager } from './SessionManager';
import { Logger } from './utils/Logger';

dotenv.config();

Logger.initialize();

// Providerの初期化
const mainProvider: MainProvider = {
    sessionManager: new SessionManager(),
    commands: [],
    components: [],
};

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
});

client.once('ready', async () => {
    await onReady(client, mainProvider);
});

client.on('messageCreate', async (message) => {
    await onMessageCreate(client, message, mainProvider);
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    await onVoiceStateUpdate(client, oldState, newState, mainProvider);
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await onCommand(client, interaction, mainProvider);
        return;
    }

    if (interaction.isMessageComponent()) {
        await onMessageComponent(client, interaction, mainProvider);
        return;
    }

    Logger.debug(interaction.type);
});

try {
    if (config.has('bot.token')) {
        client.login(config.get('bot.token'));
    } else {
        Logger.error('Tokenが設定されていません。\nconfig/default.ymlの設定を確認してください。');
    }
} catch (e) {
    Logger.error(String(e));
    process.exit(1);
}
