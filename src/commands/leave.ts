import { ApplicationCommandDataResolvable, BaseCommandInteraction } from 'discord.js';

const data: ApplicationCommandDataResolvable = {
    name: 'leave',
    description: 'botをボイスチャンネルから退出させる',
};
async function run(interaction: BaseCommandInteraction) {
    if (interaction.guild) {
        if (interaction.guild.me?.voice.channel) {
            interaction.guild.me?.voice.disconnect();
            interaction.reply('ボイスチャンネルから切断しました。');
        } else {
            interaction.reply('ボイスチャンネルに接続していません。');
        }
    } else {
        interaction.reply('このコマンドはサーバー専用です。');
    }
}

export { data, run };
