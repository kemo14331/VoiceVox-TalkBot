import { joinVoiceChannel } from '@discordjs/voice';
import { BaseCommandInteraction } from 'discord.js';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { IMAIN_PROVIDER } from '../types/IMainProvider';
import { CommandReply } from '../util/CommandReply';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'summon',
        description: 'Botをボイスチャンネルに呼び出す',
    },
    run: async (interaction: BaseCommandInteraction, mainProvider: IMAIN_PROVIDER) => {
        if (interaction.guildId && interaction.member) {
            const guild = interaction.client.guilds.cache.get(interaction.guildId);
            const member = guild?.members.cache.get(interaction.member.user.id);
            const voiceChannel = member?.voice.channel;
            if (!interaction.channel?.isText) {
                return;
            }
            if (voiceChannel && guild) {
                if (guild.me?.voice.channel) {
                    interaction.reply(CommandReply.error(`既に${voiceChannel.toString()} に参加しています。`, true));
                    return;
                }
                if (!voiceChannel.joinable) {
                    interaction.reply(CommandReply.error('ボイスチャンネルに接続できません。', true));
                    return;
                }
                let connection = joinVoiceChannel({
                    channelId: voiceChannel.id,
                    guildId: guild.id,
                    adapterCreator: guild.voiceAdapterCreator,
                });
                mainProvider.sessions.push({
                    guild: guild,
                    textChannel: interaction.channel,
                    voiceChannel: voiceChannel,
                    voiceConnection: connection,
                });
                interaction.reply(CommandReply.info(`${voiceChannel.toString()} に参加しました。`));
            } else {
                interaction.reply(CommandReply.error('Botを呼び出すにはボイスチャンネルに参加してください。', true));
            }
        } else {
            interaction.reply(CommandReply.error('このコマンドはサーバー専用です。', true));
        }
    },
};
