import axios, { AxiosResponse } from 'axios';
import { AudioQuery, Preset, Speaker, SpeakerInfo } from '../types/VoiceVoxEngineTypes';

const serverURL = 'http://localhost:50021';

const rpc = axios.create({ baseURL: serverURL, proxy: false });

/**
 * VoiceVoxEngineを操作するクラス
 */
export class VoiceVoxEngine {
    /**
     * VoiceVox-Engineと通信可能かを返す
     *
     * @return {Promise<boolean>}
     */
    public static async isReady(): Promise<boolean> {
        try {
            const response = await rpc.get('version');
            return response.status == 200;
        } catch {
            return false;
        }
    }

    /**
     * VoiceVox-Engineのバージョンを取得する
     * 失敗するとnullが返る
     *
     * @return {Promise<string | null>} バージョン文字列
     */
    public static async getVersion(): Promise<string | null> {
        try {
            const response = await rpc.get('version');
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    /**
     * 利用可能なSpeakerを取得する
     * 失敗するとnullが返る
     *
     * @return {Promise<Speaker[] | null>}
     */
    public static async getSpeakers(): Promise<Speaker[] | null> {
        try {
            const response: AxiosResponse<Speaker[]> = await rpc.get('speakers');
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    /**
     * SpeakerのUUIDから追加情報を取得する
     * 失敗するとnullが返る
     *
     * @param {string} speakerUuid speakerのUUID
     * @return {Promise<SpeakerInfo | null>}
     */
    public static async getSpeakerInfo(speakerUuid: string): Promise<SpeakerInfo | null> {
        try {
            const response: AxiosResponse<SpeakerInfo> = await rpc.get('speaker_info', {
                params: { speaker_uuid: speakerUuid },
            });
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    /**
     * 利用可能なプリセットを取得する
     * 失敗するとnullが返る
     *
     * @return {Promise<Preset[] | null>}
     */
    public static async getPresets(): Promise<Preset[] | null> {
        try {
            const response: AxiosResponse<Preset[]> = await rpc.get('presets');
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    /**
     * 音声合成用のクエリを取得する
     * 失敗するとnullが返る
     *
     * @param {string} text 合成に使うテキスト
     * @param {number} speaker SpeakerのスタイルID
     * @return {Promise<AudioQuery | null>}
     */
    public static async getAudioQuery(text: string, speaker: number): Promise<AudioQuery | null> {
        try {
            const response = await rpc.post(`/audio_query?text=${encodeURI(text)}&speaker=${speaker}`);
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    /**
     * プリセットから音声合成用のクエリを取得する
     * 失敗するとnullが返る
     *
     * @param {string} text
     * @param {number} presetId
     * @return {Promise<AudioQuery | null>}
     */
    public static async getAudioQueryFromPreset(text: string, presetId: number): Promise<AudioQuery | null> {
        try {
            const response = await rpc.post(`/audio_query_from_preset?text=${encodeURI(text)}&preset_id=${presetId}`);
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    /**
     * クエリから音声合成をする
     * 失敗するとnullが返る
     *
     * @param {AudioQuery} query 音声合成用のクエリ
     * @param {number} speaker SpeakerのスタイルID
     * @param {boolean} enableInterrogativeUpspeak 疑問系のテキストが与えられたら語尾を自動調整するか
     * @return {Promise<Buffer | null>} Wav形式のバッファ文字列
     */
    public static async synthesis(
        query: AudioQuery,
        speaker: number,
        enableInterrogativeUpspeak?: boolean
    ): Promise<Buffer | null> {
        try {
            if (!enableInterrogativeUpspeak) enableInterrogativeUpspeak = true;
            const response = await rpc.post(
                `/synthesis?speaker=${speaker}&enable_interrogative_upspeak=${enableInterrogativeUpspeak}`,
                JSON.stringify(query),
                {
                    responseType: 'arraybuffer',
                    headers: {
                        accept: 'audio/wav',
                        'Content-Type': 'application/json',
                    },
                }
            );
            if (response.status == 200) {
                const buffer = Buffer.from(response.data, 'binary');
                return buffer;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }
}
