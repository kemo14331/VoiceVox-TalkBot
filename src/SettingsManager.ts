import config from 'config';
import * as fs from 'fs';
import { UserSetting } from './models/UserSettingModel';

/**
 * ユーザーデータを管理するクラス
 */
export class DataManager {
    /**
     * ユーザーデータを読み込む
     *
     * @param {string} guildId
     * @return {UserSetting}
     */
    public static load(guildId: string): UserSetting[] {
        const path = `${config.get('bot.userDataFolder')}/${guildId}.json`;
        if (fs.existsSync(path)) {
            return JSON.parse(fs.readFileSync(path, 'utf-8')) as UserSetting[];
        } else {
            return [];
        }
    }

    /**
     * ユーザーデータを登録する
     *
     * @param {UserSetting[]} settings
     * @param {UserSetting} newSetting
     */
    public static register(settings: UserSetting[], newSetting: UserSetting) {
        const index = settings.findIndex((setting) => setting.id === newSetting.id);
        if (index != undefined && index != -1) {
            settings[index].speakerId = newSetting.speakerId;
        } else {
            settings.push(newSetting);
        }
    }

    /**
     * ユーザーデータを保存する
     *
     * @param {string} guildId
     * @param {UserSetting[]} settings
     */
    public static save(guildId: string, settings: UserSetting[]) {
        if (settings.length > 0) {
            fs.writeFileSync(`${config.get('bot.userDataFolder')}/${guildId}.json`, JSON.stringify(settings), {
                encoding: 'utf-8',
            });
        }
    }
}
