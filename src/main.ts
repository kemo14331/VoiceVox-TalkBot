import { createAudioPlayer, createAudioResource, NoSubscriberBehavior } from '@discordjs/voice';
import { ApplicationCommandDataResolvable, Client, CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import Datastore from 'nedb';
import { TalkEngine } from './talkLib/TalkEngine';
import { IMAIN_PROVIDER } from './types/IMainProvider';
import { BotMessage } from './util/BotMessage';
import { load_commands } from './util/CommandLoader';
import { bufferToStream } from './util/StreamUtil';

dotenv.config();

// Providerの初期化
const mainProvider: IMAIN_PROVIDER = {
    sessions: [],
    engine: new TalkEngine(),
    commands: [],
    userDB: new Datastore({
        filename: `${process.cwd()}/database/userdb.db`,
        autoload: true,
    }),
};

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
});

client.once('ready', async () => {
    const datas: Array<ApplicationCommandDataResolvable> = [];
    mainProvider.commands = await load_commands();
    for (const command of mainProvider.commands) {
        datas.push(command.data);
    }
    await client.application?.commands.set(datas, '851815435045568562');
    for (const guild of client.guilds.cache) {
        if (guild[1].me?.voice.channel) {
            guild[1].me.voice.disconnect();
        }
    }
    console.log('Discord-Bot is Ready.');
    console.log(`Login as ${client.user?.tag}.`);
    if (await mainProvider.engine.isReady()) {
        console.log(`VoiceVox-Engine is Ready: v${await mainProvider.engine.getVersion()}`);
    }
});

client.on('messageCreate', async (message) => {
    if (message.guild) {
        const session = mainProvider.sessions.find(
            (session) => session.textChannel.id === message.channelId && !message.author.bot
        );
        if (session) {
            const query = await mainProvider.engine.getAudioQuery(message.content, 1);
            if (query) {
                const buffer = await mainProvider.engine.Synthesis(query, 1);
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
            for (let i = 0; i < mainProvider.sessions.length; i++) {
                let session = mainProvider.sessions[i];
                if (session.guild.id === newState.guild.id) {
                    session.textChannel.send(BotMessage.info(`${session.voiceChannel.toString()} から切断しました。`));
                    mainProvider.sessions.splice(i);
                }
            }
            newState.guild.me?.voice.disconnect();
        }
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        console.log(interaction.type);
        return;
    }
    for (const command of mainProvider.commands) {
        if (command.data.name == (interaction as CommandInteraction).commandName) {
            await command.run(interaction as CommandInteraction, mainProvider);
        }
    }
});

client.login(process.env.TOKEN);
