import { VoiceConnection } from '@discordjs/voice';
import { Guild, TextBasedChannel, VoiceBasedChannel } from 'discord.js';
import { TalkingSetting } from './TalkingSettingTypes';

export interface ISESSION {
    textChannel: TextBasedChannel;
    voiceChannel: VoiceBasedChannel;
    voiceConnection: VoiceConnection;
    settings: TalkingSetting;
    guild: Guild;
}
