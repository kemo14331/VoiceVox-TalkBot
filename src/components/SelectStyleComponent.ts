import {
    MessageActionRow,
    MessageAttachment,
    MessageEmbed,
    MessageSelectMenu,
    SelectMenuInteraction,
} from 'discord.js';
import { VoiceVoxEngine } from '../talkLib/VoiceVoxEngine';
import { MessageActionComponent, MessageActionComponentExecuteOptions } from '../types/MessageActionComponentTypes';
import { CommandReply } from '../util/CommandReply';

const id = 'selectStyle';

type SelectStyleComponentModel = {
    speakerUuid: string;
};

interface SelectStyleComponent extends MessageActionComponent {
    view: (options: SelectStyleComponentModel) => Promise<MessageActionRow>;
}

export default {
    id: id,
    view: async (options: SelectStyleComponentModel): Promise<MessageActionRow | null> => {
        const speakers = await VoiceVoxEngine.getSpeakers();
        let choices: { label: string; value: string }[] = [];
        if (speakers) {
            const speaker = speakers.find((speaker) => speaker.speaker_uuid === options.speakerUuid);
            if (speaker) {
                choices = speaker.styles.map((style) => {
                    return { label: style.name, value: String(style.id) };
                });
            }
        } else {
            throw Error;
        }
        return new MessageActionRow({
            components: [
                new MessageSelectMenu({
                    custom_id: id,
                    placeholder: '選択してください',
                    options: choices,
                }),
            ],
        });
    },
    execute: async (options: MessageActionComponentExecuteOptions) => {
        await options.interaction.deferReply({ ephemeral: true });
        const styleId = (options.interaction as SelectMenuInteraction).values[0];
        const speakers = await VoiceVoxEngine.getSpeakers();
        const speaker = speakers?.find((speaker) => speaker.styles.find((style) => style.id === Number(styleId)));
        if (!speaker) {
            await options.interaction.followUp(CommandReply.error('情報の取得に失敗しました', true));
            return;
        }
        const speakerInfo = await VoiceVoxEngine.getSpeakerInfo(speaker.speaker_uuid);
        const styleInfo = speakerInfo?.style_infos.find((styleInfo) => styleInfo.id === Number(styleId));
        if (!styleInfo) {
            await options.interaction.followUp(CommandReply.error('情報の取得に失敗しました', true));
            return;
        }
        const sfbuffer = Buffer.from(styleInfo.icon, 'base64');
        const attachment = new MessageAttachment(sfbuffer, `icon_${speaker.speaker_uuid}.png`);
        await options.interaction.followUp({
            content: '以下のモデルに設定しました。',
            embeds: [
                new MessageEmbed({
                    color: 'GREEN',
                    author: {
                        name: `${speaker?.name}`,
                        icon_url: `attachment://icon_${speaker.speaker_uuid}.png`,
                    },
                    description: `${speaker.styles.find((style) => style.id === Number(styleId))?.name}`,
                }).setThumbnail(`attachment://icon_${speaker.speaker_uuid}.png`),
            ],
            files: [attachment],
            ephemeral: true,
        });
        // options.interaction.channel?.messages.cache.get(options.interaction.message.id)?.delete();
    },
} as SelectStyleComponent;
