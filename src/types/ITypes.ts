import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';
import { SessionProvider } from '../providers/SessionProvider';

// eslint-disable-next-line no-unused-vars
type ICOMMAND_RUN = (interaction: BaseCommandInteraction, sessionProvider: SessionProvider) => any;

type ICOMMAND_OBJECT = {
    data: ApplicationCommandDataResolvable;
    run: ICOMMAND_RUN;
};

export { ICOMMAND_RUN, ICOMMAND_OBJECT };
