import { Guild, TextBasedChannel, VoiceBasedChannel } from 'discord.js';

export type ISESSION = {
    textChannel: TextBasedChannel;
    voiceChannel: VoiceBasedChannel;
    guild: Guild;
};
