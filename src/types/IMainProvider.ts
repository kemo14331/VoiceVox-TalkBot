import Datastore from 'nedb';
import { TalkEngine } from '../talkLib/TalkEngine';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { ISESSION } from '../types/ISettionTypes';

export interface IMAIN_PROVIDER {
    sessions: ISESSION[];
    commands: ICOMMAND_OBJECT[];
    engine: TalkEngine;
    userDB: Datastore;
}
