import { Client, VoiceState } from 'discord.js';
import { MainProvider } from '../models/MainProviderModel';
import { BotMessage } from '../utils/messages/BotMessage';

/**
 * ボイスチャンネルの状態が更新されたときに呼ばれる
 *
 * @param {Client} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 * @param {MainProvider} mainProvider
 */
export async function onVoiceStateUpdate(
    client: Client,
    oldState: VoiceState,
    newState: VoiceState,
    mainProvider: MainProvider
) {
    if (newState.guild.me?.voice.channel) {
        if (!newState.guild.me?.voice.channel.members.some((member) => !member.user.bot)) {
            console.log(`Leaved All Members: ${newState.guild.me.voice.channel.toString()}`);
            const session = mainProvider.sessionManager.sessions.find(
                (session) => session.guild.id === newState.guild.id
            );
            if (session) {
                mainProvider.sessionManager.delete(session);
                session.textChannel.send(BotMessage.info(`${session.voiceChannel.toString()} から切断しました。`));
            }
        }
    } else {
        // キックなど
        const session = mainProvider.sessionManager.sessions.find((session) => session.guild.id === oldState.guild.id);
        if (session) {
            mainProvider.sessionManager.delete(session);
        }
    }
}
