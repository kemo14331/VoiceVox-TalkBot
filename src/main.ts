import { ApplicationCommandDataResolvable, Client, CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import commands from './commands';
import { MainProvider } from './providers/MainProvider';
import { TalkEngine } from './talkLib/talkEngine';
import { BotMessage } from './util/BotMessage';

dotenv.config();

// Providerの初期化
let mainProvider: MainProvider = { sessions: [], engine: new TalkEngine() };

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'],
});

client.once('ready', async () => {
    const datas: Array<ApplicationCommandDataResolvable> = [];
    for (const command of commands) {
        datas.push((await command).data);
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
        let session = mainProvider.sessions.find(
            (session) => session.textChannel.id === message.channelId && !message.author.bot
        );
        if (session) {
            //session.voiceConnection.playOpusPacket();
            console.log(message.content);
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
    for (const command of commands) {
        if ((await command).data.name == (interaction as CommandInteraction).commandName) {
            await (await command).run(interaction as CommandInteraction, mainProvider);
        }
    }
});

client.login(process.env.TOKEN);
