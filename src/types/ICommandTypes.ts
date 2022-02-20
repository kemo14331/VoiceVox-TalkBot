import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';
import { MainProvider } from '../providers/MainProvider';

// eslint-disable-next-line no-unused-vars
type ICOMMAND_RUN = (interaction: BaseCommandInteraction, mainProvider: MainProvider) => any;

type ICOMMAND_OBJECT = {
    data: ApplicationCommandData;
    run: ICOMMAND_RUN;
};

export { ICOMMAND_RUN, ICOMMAND_OBJECT };
