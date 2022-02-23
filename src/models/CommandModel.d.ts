import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';
import { MainProvider } from './MainProviderModel';

type CommandExecuteOptions = { interaction: BaseCommandInteraction; mainProvider: MainProvider };

// eslint-disable-next-line no-unused-vars
type CommandExecuteType = (options: CommandExecuteOptions) => any;

interface CommandObject {
    data: ApplicationCommandData;
    execute: CommandExecuteType;
}

export { CommandExecuteOptions, CommandExecuteType, CommandObject };
