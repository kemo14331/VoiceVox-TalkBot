import { CommandObject } from './CommandTypes';
import { Session } from './SettionTypes';

export type MainProvider = {
    sessions: Session[];
    commands: CommandObject[];
};
