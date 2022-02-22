import { SessionManager } from '../util/SessionManager';
import { CommandObject } from './CommandTypes';

export type MainProvider = {
    sessionManager: SessionManager;
    commands: CommandObject[];
};
