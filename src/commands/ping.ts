import { CommandExecuteOption, ICOMMAND_OBJECT } from '../types/ICommandTypes';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'ping',
        description: 'pongを返す',
    },
    execute: (options: CommandExecuteOption) => {
        options.interaction.reply('pong!');
    },
};
