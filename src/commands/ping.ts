import { BaseCommandInteraction } from 'discord.js';
import { MainProvider } from '../providers/MainProvider';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'ping',
        description: 'pongを返す',
    },
    // eslint-disable-next-line no-unused-vars
    run: (interaction: BaseCommandInteraction, mainProvider: MainProvider) => {
        interaction.reply('pong!');
    },
};
