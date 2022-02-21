import { ICOMMAND_OBJECT } from './ICommandTypes';
import { ISESSION } from './ISettionTypes';

export interface IMAIN_PROVIDER {
    sessions: ISESSION[];
    commands: ICOMMAND_OBJECT[];
}
