import { createAudioPlayer, createAudioResource, NoSubscriberBehavior } from '@discordjs/voice';
import { ApplicationCommandDataResolvable, Client, CommandInteraction, MessageComponentInteraction } from 'discord.js';
import dotenv from 'dotenv';
import { VoiceVoxEngine } from './talkLib/VoiceVoxEngine';
import { MainProvider } from './types/MainProvider';
import { BotMessage } from './util/BotMessage';
import { loadCommands, registerCommands } from './util/CommandRegister';
import { loadComponents } from './util/ComponentResister';
import { Logger } from './util/Logger';
import { SessionManager } from './util/SessionManager';
import { bufferToStream } from './util/StreamUtil';

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
    mainProvider.commands = await loadCommands();
    Logger.info(`Loaded ${mainProvider.commands.length} commands.`);
    mainProvider.components = await loadComponents();
    Logger.info(`Loaded ${mainProvider.components.length} components.`);
    const datas: Array<ApplicationCommandDataResolvable> = mainProvider.commands.map((command) => command.data);
    await registerCommands({ client: client, datas: datas, guildId: '851815435045568562' });
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
});

client.on('messageCreate', async (message) => {
    if (message.guild) {
        const session = mainProvider.sessionManager.sessions.find(
            (session) => session.textChannel.id === message.channelId && !message.author.bot
        );
        if (session) {
            const query = await VoiceVoxEngine.getAudioQuery(message.content, 1);
            if (query) {
                const buffer = await VoiceVoxEngine.synthesis(query, 1);
                if (buffer) {
                    const player = createAudioPlayer({
                        behaviors: {
                            noSubscriber: NoSubscriberBehavior.Pause,
                        },
                    });
                    const resource = createAudioResource(bufferToStream(buffer));
                    player.play(resource);
                    session.voiceConnection.subscribe(player);
                }
            }
        }
    }
});

client.on('voiceStateUpdate', async (_, newState) => {
    if (newState.guild.me?.voice.channel) {
        if (!newState.guild.me?.voice.channel.members.some((member) => !member.user.bot)) {
            console.log(`Leaved All Members: ${newState.guild.me.voice.channel.toString()}`);
            const session = mainProvider.sessionManager.sessions.find(
                (session) => session.guild.id === newState.guild.id
            );
            if (session) {
                mainProvider.sessionManager.delete(session);
                session.textChannel.send(BotMessage.info(`${session.voiceChannel.toString()} から切断しました。`));
            }
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        for (const command of mainProvider.commands) {
            if (command.data.name === (interaction as CommandInteraction).commandName) {
                await command.execute({
                    interaction: interaction,
                    mainProvider: mainProvider,
                });
            }
        }
        return;
    }

    if (interaction.isMessageComponent()) {
        for (const component of mainProvider.components) {
            if (component.id === (interaction as MessageComponentInteraction).customId) {
                await component.execute({ interaction: interaction, mainProvider: mainProvider });
            }
        }
        return;
    }

    Logger.debug(interaction.type);
});

client.login(process.env.TOKEN);
