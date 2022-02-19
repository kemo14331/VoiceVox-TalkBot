import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';

const data: ApplicationCommandDataResolvable = {
    name: 'ping',
    description: 'pongを返す',
};
async function run(interaction: BaseCommandInteraction) {
    interaction.reply('pong!');
}

export { data, run };
