import { VoiceConnection } from '@discordjs/voice';
import { Guild, TextBasedChannel, VoiceBasedChannel } from 'discord.js';
import { TalkingSetting } from './TalkingSettingModel';

export interface Session {
    textChannel: TextBasedChannel;
    voiceChannel: VoiceBasedChannel;
    voiceConnection: VoiceConnection;
    settings: TalkingSetting;
    guild: Guild;
}
