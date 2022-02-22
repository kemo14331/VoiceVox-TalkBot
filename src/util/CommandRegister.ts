import { ApplicationCommandData, ApplicationCommandDataResolvable, Client } from 'discord.js';
import glob from 'glob';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';

/**
 * commands内のコマンドをロードする
 *
 * @return {Promise<ICOMMAND_OBJECT[]>}
 */
export async function loadCommands(): Promise<ICOMMAND_OBJECT[]> {
    return new Promise(function (resolve, reject) {
        glob(__dirname + '/../commands/*.ts', function (err, res) {
            if (err) {
                reject(err);
            }
            Promise.all(
                res.map(async (file) => {
                    const func = require(file.replace(__dirname, '.').replace('.ts', ''));
                    return (await func()) as ICOMMAND_OBJECT;
                })
            ).then(async (commands) => {
                console.log(`Loaded ${commands.length} commands.`);
                resolve(commands);
            });
        });
    });
}

type ResisterCommandsOptions = {
    client: Client;
    datas: ApplicationCommandData[] | ApplicationCommandDataResolvable[];
    guildId?: string;
};

/**
 * コマンドを登録する。
 * guildIdを指定しない場合、全体コマンドとして登録する。(反映されるまで1時間程度かかる)
 *
 * @param {ResisterCommandsOptions} options
 */
export async function registerCommands(options: ResisterCommandsOptions) {
    if (options.guildId) {
        await options.client.application?.commands.set(options.datas, options.guildId);
    } else {
        await options.client.application?.commands.set(options.datas);
    }
}