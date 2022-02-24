import { createAudioPlayer, createAudioResource, NoSubscriberBehavior } from '@discordjs/voice';
import config from 'config';
import { Client, Message } from 'discord.js';
import { MainProvider } from '../models/MainProviderModel';
import { bufferToStream } from '../utils/StreamUtil';
import { VoiceVoxEngine } from '../VoiceVoxEngine';

/**
 * メッセージが送信された時に呼ばれる
 *
 * @param {Client} client
 * @param {Message} message
 * @param {MainProvider} mainProvider
 */
export async function onMessageCreate(client: Client, message: Message, mainProvider: MainProvider) {
    if (message.guild) {
        const session = mainProvider.sessionManager.sessions.find(
            (session) => session.textChannel.id === message.channelId && !message.author.bot
        );
        if (session) {
            let speaker = Number(config.get('voicevox.defaultSpeaker'));
            const setting = session.settings.find((setting) => setting.id === message.author.id);
            if (setting) {
                speaker = setting.speakerId;
            }
            const query = await VoiceVoxEngine.getAudioQuery(message.content, speaker);
            if (query) {
                const buffer = await VoiceVoxEngine.synthesis(query, speaker);
                if (buffer) {
                    const player = createAudioPlayer({
                        behaviors: {
                            noSubscriber: NoSubscriberBehavior.Pause,
                        },
                    });
                    const resource = createAudioResource(bufferToStream(buffer));
                    player.play(resource);
                    session.voiceConnection.subscribe(player);
                }
            }
        }
    }
}
