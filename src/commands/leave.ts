import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';
import { SessionProvider } from '../providers/SessionProvider';
import { CommandReply } from '../util.ts/CommandReply';

const data: ApplicationCommandDataResolvable = {
    name: 'leave',
    description: 'botをボイスチャンネルから退出させる',
};
// eslint-disable-next-line no-unused-vars
async function run(interaction: BaseCommandInteraction, sessionProvider: SessionProvider) {
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
