import glob from 'glob';
import { MessageActionComponent } from '../types/MessageActionComponentTypes';
import { Logger } from './Logger';

/**
 * コンポーネントをロードする
 * @return {Promise<MessageActionComponent[]>}
 */
export async function loadComponents(): Promise<MessageActionComponent[]> {
    return new Promise(function (resolve, reject) {
        glob(__dirname + '/../components/*.ts', function (err, res) {
            if (err) {
                reject(err);
            }
            Promise.all(
                res.map(async (file) => {
                    try {
                        return (await import(file.replace(__dirname, '.').replace('.ts', ''))).default;
                    } catch (e) {
                        Logger.error(`Faild to load component: ${file}`);
                        Logger.trace(String(e));
                    }
                })
            ).then(async (components) => {
                resolve(components.filter((components) => components) as MessageActionComponent[]);
            });
        });
    });
}
