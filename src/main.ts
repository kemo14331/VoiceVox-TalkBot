import { ApplicationCommandDataResolvable, Client, CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import commands from './commands';

dotenv.config();

const client = new Client({
    intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES'],
});

client.once('ready', async () => {
    const datas: Array<ApplicationCommandDataResolvable> = [];
    for (const command of commands) {
        datas.push((await command).data);
    }
    await client.application?.commands.set(datas, '851815435045568562');
    console.log('Ready');
    console.log(client.user?.tag);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    for (const command of commands) {
        if ((await command).data.name == (interaction as CommandInteraction).commandName) {
            await (await command).run(interaction as CommandInteraction);
        }
    }
});

client.login(process.env.TOKEN);
