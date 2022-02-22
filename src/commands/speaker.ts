import {
    ApplicationCommandOptionChoice,
    CommandInteractionOptionResolver,
    MessageActionRow,
    MessageAttachment,
    MessageEmbed,
    MessageSelectMenu,
} from 'discord.js';
import { VoiceVoxEngine } from '../talkLib/VoiceVoxEngine';
import { CommandExecuteOptions, CommandObject } from '../types/CommandTypes';
import { BotMessage } from '../util/BotMessage';
import { CommandReply } from '../util/CommandReply';

/**
 * Speakersパラメータの選択肢を得る
 * @return {Promise<ApplicationCommandOptionChoice[]>} speakersパラメータの選択肢配列
 */
async function genSpeakerChoices(): Promise<ApplicationCommandOptionChoice[]> {
    const speakers = await VoiceVoxEngine.getSpeakers();
    if (speakers) {
        return speakers.map((speaker) => {
            return { name: speaker.name, value: speaker.speaker_uuid };
        });
    }
    return [];
}

module.exports = async (): Promise<CommandObject> => {
    return {
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
                            required: true,
                            choices: await genSpeakerChoices(),
                        },
                    ],
                },
            ],
        },
        execute: async (options: CommandExecuteOptions) => {
            switch ((options.interaction.options as CommandInteractionOptionResolver).getSubcommand(true)) {
                case 'list': {
                    const speakersEmbeds: MessageEmbed[] = [];
                    const files = [];
                    const speakers = await VoiceVoxEngine.getSpeakers();
                    if (!speakers) {
                        await options.interaction.followUp(CommandReply.error('Speakerの取得に失敗しました。', true));
                        return;
                    }
                    for (const speaker of speakers) {
                        const speakerInfo = await VoiceVoxEngine.getSpeakerInfo(speaker.speaker_uuid);
                        const embed = new MessageEmbed({
                            color: 'GREEN',
                            title: speaker.name,
                        });
                        if (speakerInfo) {
                            const sfbuffer = Buffer.from(speakerInfo.style_infos[0].icon, 'base64');
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
                    await options.interaction.reply({
                        embeds: speakersEmbeds,
                        files: files,
                        ephemeral: true,
                    });
                    break;
                }
                case 'set': {
                    const speakerUuid = (options.interaction.options as CommandInteractionOptionResolver).getString(
                        'speaker',
                        true
                    );
                    const speakers = await VoiceVoxEngine.getSpeakers();
                    if (speakers) {
                        const speaker = speakers.find((speaker) => speaker.speaker_uuid === speakerUuid);
                        if (speaker) {
                            const row = new MessageActionRow({
                                components: [
                                    new MessageSelectMenu({
                                        custom_id: 'selectStyle',
                                        placeholder: '選択してください',
                                        options: speaker.styles.map((style) => {
                                            return { label: style.name, value: String(style.id) };
                                        }),
                                    }),
                                ],
                            });
                            options.interaction.reply({
                                embeds: BotMessage.info(`${speaker.name} のスタイルを選択してください`).embeds,
                                components: [row],
                                ephemeral: true,
                            });
                            break;
                        }
                    }
                    options.interaction.reply(CommandReply.error('情報の取得に失敗しました。', true));
                    break;
                }
            }
        },
    };
};
