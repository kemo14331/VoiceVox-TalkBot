import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';
import { MainProvider } from '../providers/MainProvider';

// eslint-disable-next-line no-unused-vars
type CommandRunType = (interaction: BaseCommandInteraction, mainProvider: MainProvider) => any;

interface ICOMMAND_OBJECT {
    data: ApplicationCommandData;
    run: CommandRunType;
}

export { CommandRunType, ICOMMAND_OBJECT };
