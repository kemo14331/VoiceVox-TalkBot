import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';
import { IMAIN_PROVIDER } from '../types/IMainProvider';

type CommandExecuteOption = { interaction: BaseCommandInteraction; mainProvider: IMAIN_PROVIDER };

// eslint-disable-next-line no-unused-vars
type CommandExecuteType = (options: CommandExecuteOption) => any;

interface ICOMMAND_OBJECT {
    data: ApplicationCommandData;
    execute: CommandExecuteType;
}

export { CommandExecuteOption, CommandExecuteType, ICOMMAND_OBJECT };
