import { CommandExecuteOptions, CommandObject } from '../types/CommandTypes';

module.exports = async (): Promise<CommandObject> => {
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
