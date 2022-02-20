import { ApplicationCommandData, BaseCommandInteraction } from 'discord.js';
import { MainProvider } from '../providers/MainProvider';
import { CommandReply } from '../util/CommandReply';

const data: ApplicationCommandData = {
    name: 'leave',
    description: 'botをボイスチャンネルから退出させる',
};
// eslint-disable-next-line no-unused-vars
async function run(interaction: BaseCommandInteraction, mainProvider: MainProvider) {
    if (interaction.guild) {
        if (interaction.guild.me?.voice.channel) {
            interaction.guild.me?.voice.disconnect();
            interaction.reply(CommandReply.info(`${interaction.guild.me.voice.channel.toString()} から切断しました。`));
        } else {
            interaction.reply(CommandReply.error('ボイスチャンネルに接続していません。', true));
        }
    } else {
        interaction.reply(CommandReply.error('このコマンドはサーバー専用です。', true));
    }
}

export { data, run };
