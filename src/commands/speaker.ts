import {
    CommandInteractionOptionResolver,
    MessageActionRow,
    MessageAttachment,
    MessageEmbed,
    MessageSelectMenu,
} from 'discord.js';
import { VoiceVoxEngine } from '../talkLib/VoiceVoxEngine';
import { CommandExecuteOptions, ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { CommandReply } from '../util/CommandReply';

// async function genSpeakerChoices(): Promise<ApplicationCommandOptionChoice[]> {
//     const voiceVoxEngine = new VoiceVoxEngine();
//     const speakers = await voiceVoxEngine.getSpeakers();
//     if (speakers) {
//         return speakers.map((speaker) => {
//             return { name: speaker.name, value: speaker.speaker_uuid };
//         });
//     }
//     return [];
// }

export const command: ICOMMAND_OBJECT = {
    data: {
        name: 'speaker',
        description: '音声モデルに関するコマンド',
        options: [
            {
                type: 'SUB_COMMAND',
                name: 'list',
                description: '使用可能な音声モデルの一覧を表示する',
            },
            {
                type: 'SUB_COMMAND',
                name: 'set',
                description: '読み上げに使用する音声モデルを設定する',
                options: [
                    {
                        type: 'STRING',
                        name: 'speaker',
                        description: '使用する音声モデル',
                        //choices: await genSpeakerChoices(),
                    },
                ],
            },
        ],
    },
    execute: async (options: CommandExecuteOptions) => {
        const voiceVoxEngine = new VoiceVoxEngine();
        switch ((options.interaction.options as CommandInteractionOptionResolver).getSubcommand(true)) {
            case 'list': {
                const speakersEmbeds: MessageEmbed[] = [];
                const files = [];
                const speakers = await voiceVoxEngine.getSpeakers();
                await options.interaction.deferReply({ ephemeral: true });
                if (!speakers) {
                    await options.interaction.followUp(CommandReply.error('Speakerの取得に失敗しました。', true));
                    return;
                }
                for (const speaker of speakers) {
                    const speaker_info = await voiceVoxEngine.getSpeakerInfo({
                        speaker_uuid: speaker.speaker_uuid,
                    });
                    const embed = new MessageEmbed({
                        color: 'GREEN',
                        title: speaker.name,
                    });
                    if (speaker_info) {
                        const sfbuffer = Buffer.from(speaker_info.style_infos[0].icon, 'base64');
                        const attachment = new MessageAttachment(sfbuffer, `icon_${speaker.speaker_uuid}.png`);
                        files.push(attachment);
                        // embed.setAuthor({
                        //     name: speaker.name,
                        //     iconURL: `attachment://icon_${speaker.speaker_uuid}.png`,
                        // });
                        embed.setTitle(speaker.name);
                        embed.addField('UUID', speaker.speaker_uuid);
                        embed.setThumbnail(`attachment://icon_${speaker.speaker_uuid}.png`);
                        let styleIdText = '';
                        for (const style of speaker.styles) {
                            styleIdText += `${style.name},`;
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
                break;
            }
            case 'set': {
                const speakers = await voiceVoxEngine.getSpeakers();
                if (speakers) {
                    const selectMenuOptions = speakers.map((speaker) => {
                        return { label: speaker.name, value: speaker.speaker_uuid };
                    });
                    const row = new MessageActionRow({
                        components: [
                            new MessageSelectMenu({
                                custom_id: 'id',
                                placeholder: '選択してください',
                                options: selectMenuOptions,
                            }),
                        ],
                    });
                    options.interaction.followUp({ content: '音声モデルを選択してください', components: [row] });
                }
                break;
            }
        }
    },
};
