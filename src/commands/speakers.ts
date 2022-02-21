import { MessageAttachment, MessageEmbed } from 'discord.js';
import { TalkEngine } from '../talkLib/TalkEngine';
import { CommandExecuteOption, ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { CommandReply } from '../util/CommandReply';

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'speakers',
        description: '使用可能なSpeakerを表示する',
    },
    execute: async (options: CommandExecuteOption) => {
        const talkEngine = new TalkEngine();
        await options.interaction.deferReply();
        const speakersEmbeds: MessageEmbed[] = [];
        const files = [];
        const speakers = await talkEngine.getSpeakers();
        if (!speakers) {
            await options.interaction.followUp(CommandReply.error('Speakerの取得に失敗しました。', true));
            return;
        }
        for (const speaker of speakers) {
            const speaker_info = await talkEngine.getSpeakerInfo({ speaker_uuid: speaker.speaker_uuid });
            const embed = new MessageEmbed({
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
                let styleIdText = '';
                for (const style of speaker.styles) {
                    styleIdText += `${style.name}: ${style.id}\n`;
                }
                embed.addField('Styles', styleIdText);
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
        await options.interaction.followUp({
            embeds: speakersEmbeds,
            files: files,
            ephemeral: true,
        });
    },
};
