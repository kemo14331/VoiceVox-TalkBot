import { TalkEngine } from '../talkLib/talkEngine';
import { ISESSION } from '../types/ISettionTypes';

export interface MainProvider {
    sessions: ISESSION[];
    engine: TalkEngine;
}
