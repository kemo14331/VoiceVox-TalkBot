import { VoiceConnection } from '@discordjs/voice';
import { Guild, TextBasedChannel, VoiceBasedChannel } from 'discord.js';
import { UserSetting } from './UserSettingModel';

export interface Session {
    textChannel: TextBasedChannel;
    voiceChannel: VoiceBasedChannel;
    voiceConnection: VoiceConnection;
    settings: UserSetting[];
    guild: Guild;
}
