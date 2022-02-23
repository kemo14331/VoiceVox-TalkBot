import { CommandExecuteOptions, CommandObject } from '../models/CommandModel';

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
