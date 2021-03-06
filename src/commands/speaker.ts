import {
    ApplicationCommandOptionChoice,
    CommandInteractionOptionResolver,
    MessageAttachment,
    MessageEmbed,
} from 'discord.js';
import SelectStyleComponent from '../components/SelectStyleComponent';
import { CommandExecuteOptions, CommandObject } from '../models/CommandModel';
import { BotMessage } from '../utils/messages/BotMessage';
import { CommandReply } from '../utils/messages/CommandReply';
import { VoiceVoxEngine } from '../VoiceVoxEngine';

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
    return [{ name: '利用可能なモデルはありません', value: 'null' }];
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
                    await options.interaction.deferReply({ ephemeral: true });
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
                    await options.interaction.followUp({
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
                    if (speakerUuid === 'null') {
                        await options.interaction.reply(
                            CommandReply.error('Botのリロードが必要です。\n管理者にお問い合わせ下さい。', true)
                        );
                        return;
                    }
                    try {
                        const view = await SelectStyleComponent.view({ speakerUuid: speakerUuid });
                        await options.interaction.reply({
                            embeds: BotMessage.info(`スタイルを選択してください。`).embeds,
                            components: [view],
                            ephemeral: true,
                        });
                    } catch {
                        await options.interaction.reply(CommandReply.error('スタイル情報の取得に失敗しました。', true));
                    }
                    break;
                }
            }
        },
    };
};
