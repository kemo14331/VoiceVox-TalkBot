import { Session } from './models/SettionModel';
import { Logger } from './utils/Logger';

/**
 * セッションの管理クラス
 */
export class SessionManager {
    /**
     * 登録されているセッション
     */
    readonly sessions: Session[];

    /**
     * コンストラクタ
     */
    constructor() {
        this.sessions = [];
    }

    /**
     * セッションを削除する
     *
     * @param {Session} session
     * @return {boolean} 削除が成功したか
     */
    public delete(session: Session): boolean {
        const index = this.sessions.indexOf(session);
        if (index != undefined) {
            session.voiceConnection.disconnect();
            this.sessions.splice(index);
            return true;
        } else {
            Logger.error(`Failed to delete session: (guildId: ${session.guild.id})`);
            return false;
        }
    }

    /**
     * 指定したギルドIDのセッションを削除する
     *
     * @param {string} guildId
     * @return {boolean} 削除が成功したか
     */
    public deleteWithGuildId(guildId: string): boolean {
        const session = this.sessions.find((session) => session.guild.id === guildId);
        if (session) {
            return this.delete(session);
        } else {
            return false;
        }
    }

    /**
     * セッションを登録する
     *
     * @param {Session} session
     */
    public register(session: Session) {
        this.sessions.push(session);
    }
}
