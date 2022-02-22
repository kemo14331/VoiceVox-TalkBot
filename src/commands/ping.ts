import { CommandExecuteOptions, ICOMMAND_OBJECT } from '../types/ICommandTypes';

module.exports = async (): Promise<ICOMMAND_OBJECT> => {
    return {
        data: {
            name: 'ping',
            description: 'pongを返す',
        },
        execute: (options: CommandExecuteOptions) => {
            options.interaction.reply('pong!');
        },
    };
};
