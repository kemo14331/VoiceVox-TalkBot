import {
    ApplicationCommandOptionChoice,
    CommandInteractionOptionResolver,
    MessageAttachment,
    MessageEmbed,
} from 'discord.js';
import { VoiceVoxEngine } from '../talkLib/VoiceVoxEngine';
import { CommandExecuteOptions, ICOMMAND_OBJECT } from '../types/ICommandTypes';
import { CommandReply } from '../util/CommandReply';

/**
 * Speakersパラメータの選択肢を得る
 * @return {Promise<ApplicationCommandOptionChoice[]>} speakersパラメータの選択肢配列
 */
async function genSpeakerChoices(): Promise<ApplicationCommandOptionChoice[]> {
    const voiceVoxEngine = new VoiceVoxEngine();
    const speakers = await voiceVoxEngine.getSpeakers();
    if (speakers) {
        return speakers.map((speaker) => {
            return { name: speaker.name, value: speaker.speaker_uuid };
        });
    }
    return [];
}

module.exports = async (): Promise<ICOMMAND_OBJECT> => {
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
                        const speakerInfo = await voiceVoxEngine.getSpeakerInfo(speaker.speaker_uuid);
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
                    options.interaction.reply({ content: '音声モデルを選択してください' });
                    break;
                }
            }
        },
    };
};