import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';
import { MainProvider } from './MainProvider';

type CommandExecuteOptions = { interaction: BaseCommandInteraction; mainProvider: MainProvider };

// eslint-disable-next-line no-unused-vars
type CommandExecuteType = (options: CommandExecuteOptions) => any;

type CommandObject = {
    data: ApplicationCommandData;
    execute: CommandExecuteType;
};

export { CommandExecuteOptions, CommandExecuteType, CommandObject };
