import glob from 'glob';
import { ICOMMAND_OBJECT } from '../types/ICommandTypes';

export async function load_commands(): Promise<ICOMMAND_OBJECT[]> {
    return new Promise(function (resolve, reject) {
        glob(__dirname + '/../commands/*.ts', function (err, res) {
            if (err) {
                reject(err);
            }
            Promise.all(
                res.map((file) => {
                    return import(file.replace(__dirname, '.').replace('.ts', ''));
                })
            ).then((modules) => {
                let commands: ICOMMAND_OBJECT[] = [];
                modules.map((module) => {
                    commands.push(module.command);
                });
                console.log(`Loaded ${commands.length} commands.`);
                resolve(commands);
            });
        });
    });
}