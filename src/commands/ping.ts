import { CommandExecuteOptions, CommandObject } from '../types/CommandTypes';

module.exports = async (): Promise<CommandObject> => {
    return {
        data: {
            name: 'ping',
            description: 'pongを返す',
        },
        execute: async (options: CommandExecuteOptions) => {
            await options.interaction.reply('pong!');
        },
    };
};
