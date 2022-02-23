import { createAudioPlayer, createAudioResource, NoSubscriberBehavior } from '@discordjs/voice';
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
            const query = await VoiceVoxEngine.getAudioQuery(message.content, 1);
            if (query) {
                const buffer = await VoiceVoxEngine.synthesis(query, 1);
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
