import { SessionManager } from '../SessionManager';
import { CommandObject } from './CommandModel';
import { MessageActionComponent } from './MessageActionComponentModel';

export interface MainProvider {
    sessionManager: SessionManager;
    commands: CommandObject[];
    components: MessageActionComponent[];
}
