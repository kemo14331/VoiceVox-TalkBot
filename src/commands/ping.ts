import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';
import { MainProvider } from '../providers/MainProvider';

const data: ApplicationCommandDataResolvable = {
    name: 'ping',
    description: 'pongを返す',
};
// eslint-disable-next-line no-unused-vars
async function run(interaction: BaseCommandInteraction, mainProvider: MainProvider) {
    interaction.reply('pong!');
}

export { data, run };
