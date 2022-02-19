import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';

// eslint-disable-next-line no-unused-vars
type ICOMMAND_RUN = (interaction: BaseCommandInteraction) => any;

type ICOMMAND_OBJECT = {
    data: ApplicationCommandDataResolvable;
    run: ICOMMAND_RUN;
};

export { ICOMMAND_RUN, ICOMMAND_OBJECT };
