import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';
import { IMAIN_PROVIDER } from '../types/IMainProvider';

type CommandExecuteOptions = { interaction: BaseCommandInteraction; mainProvider: IMAIN_PROVIDER };

// eslint-disable-next-line no-unused-vars
type CommandExecuteType = (options: CommandExecuteOptions) => any;

interface ICOMMAND_OBJECT {
    data: ApplicationCommandData;
    execute: CommandExecuteType;
}

export { CommandExecuteOptions, CommandExecuteType, ICOMMAND_OBJECT };
