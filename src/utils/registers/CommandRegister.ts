import { ApplicationCommandData, ApplicationCommandDataResolvable, Client } from 'discord.js';
import glob from 'glob';
import { CommandObject } from '../../models/CommandModel';
import { Logger } from '../Logger';

/**
 * commands内のコマンドをロードする
 *
 * @return {Promise<CommandObject[]>}
 */
export async function loadCommands(): Promise<CommandObject[]> {
    return new Promise(function (resolve, reject) {
        glob(process.cwd() + '/src/commands/*.ts', function (err, res) {
            if (err) {
                reject(err);
            }
            Promise.all(
                res.map(async (file) => {
                    try {
                        const func = require(file.replace(__dirname, '.').replace('.ts', ''));
                        return (await func()) as CommandObject;
                    } catch (e) {
                        Logger.error(`Faild to load command: ${file}`);
                        Logger.trace(String(e));
                    }
                })
            ).then(async (commands) => {
                resolve(commands.filter((command) => command) as CommandObject[]);
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
