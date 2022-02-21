import { BaseCommandInteraction } from 'discord.js';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { IMAIN_PROVIDER } from '../types/IMainProvider';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'ping',
        description: 'pongを返す',
    },
    // eslint-disable-next-line no-unused-vars
    run: (interaction: BaseCommandInteraction, mainProvider: IMAIN_PROVIDER) => {
        interaction.reply('pong!');
    },
};
