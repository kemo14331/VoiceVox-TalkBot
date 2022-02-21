import { BaseCommandInteraction, MessageAttachment, MessageEmbed } from 'discord.js';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { IMAIN_PROVIDER } from '../types/IMainProvider';
import { CommandReply } from '../util/CommandReply';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'speakers',
        description: '使用可能なSpeakerを表示する',
    },
    // eslint-disable-next-line no-unused-vars
    run: async (interaction: BaseCommandInteraction, mainProvider: IMAIN_PROVIDER) => {
        await interaction.deferReply();
        const speakers = await mainProvider.engine.getSpeakers();
        let speakersEmbeds: MessageEmbed[] = [];
        let files = [];
        if (!speakers) {
            await interaction.followUp(CommandReply.error('Speakerの取得に失敗しました。', true));
            return;
        }
        for (const speaker of speakers) {
            const speaker_info = await mainProvider.engine.getSpeakerInfo(speaker.speaker_uuid);
            let embed = new MessageEmbed({
                color: 'GREEN',
                author: {
                    name: speaker.name,
                },
            });
            if (speaker_info) {
                const sfbuffer = Buffer.from(speaker_info.style_infos[0].icon, 'base64');
                const attachment = new MessageAttachment(sfbuffer, `icon_${speaker.speaker_uuid}.png`);
                files.push(attachment);
                embed.setAuthor({
                    name: speaker.name,
                    iconURL: `attachment://icon_${speaker.speaker_uuid}.png`,
                });
                embed.addField('UUID', speaker.speaker_uuid);
                if (speaker.version) {
                    embed.addField('Version', speaker.version);
                } else {
                    embed.addField('Version', '不明');
                }
            } else {
                embed.description = '情報の取得に失敗しました。';
            }
            speakersEmbeds.push(embed);
        }
        await interaction.followUp({
            embeds: speakersEmbeds,
            files: files,
            ephemeral: true,
        });
    },
};
