import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';
import { SessionProvider } from '../providers/SessionProvider';

const data: ApplicationCommandDataResolvable = {
    name: 'ping',
    description: 'pongを返す',
};
// eslint-disable-next-line no-unused-vars
async function run(interaction: BaseCommandInteraction, sessionProvider: SessionProvider) {
    interaction.reply('pong!');
}

export { data, run };
