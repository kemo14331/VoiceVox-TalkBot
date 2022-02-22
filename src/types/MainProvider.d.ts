import { SessionManager } from '../util/SessionManager';
import { CommandObject } from './CommandTypes';
import { MessageActionComponent } from './MessageActionComponentTypes';

export type MainProvider = {
    sessionManager: SessionManager;
    commands: CommandObject[];
    components: MessageActionComponent[];
};
