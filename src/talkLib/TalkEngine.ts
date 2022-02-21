import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AudioQuery, Preset, Speaker, SpeakerInfo } from '../types/ITalkEngineTypes';

const serverURL = 'http://localhost:50021';

export class TalkEngine {
    private rpc: AxiosInstance;
    constructor() {
        this.rpc = axios.create({ baseURL: serverURL, proxy: false });
    }

    async isReady(): Promise<boolean> {
        try {
            const response = await this.rpc.get('version');
            return response.status == 200;
        } catch {
            return false;
        }
    }

    async getVersion(): Promise<string | null> {
        try {
            const response = await this.rpc.get('version');
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    async getSpeakers(): Promise<Speaker[] | null> {
        try {
            const response: AxiosResponse<Speaker[]> = await this.rpc.get('speakers');
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    async getSpeakerInfo(speaker_uuid: string): Promise<SpeakerInfo | null> {
        try {
            const response: AxiosResponse<SpeakerInfo> = await this.rpc.get('speaker_info', {
                params: { speaker_uuid: speaker_uuid },
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

    async getPresets(): Promise<Preset[] | null> {
        try {
            const response: AxiosResponse<Preset[]> = await this.rpc.get('presets');
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    async getAudioQuery(text: string, speaker: number): Promise<AudioQuery | null> {
        try {
            const response = await this.rpc.post(`/audio_query?text=${encodeURI(text)}&speaker=${speaker}`);
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    async getAudioQueryFromPreset(text: string, preset_id: number): Promise<AudioQuery | null> {
        try {
            const response = await this.rpc.post(
                `/audio_query_from_preset?text=${encodeURI(text)}&preset_id=${preset_id}`
            );
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    async Synthesis(
        query: AudioQuery,
        speaker: number,
        enable_interrogative_upspeak: boolean = true
    ): Promise<Buffer | null> {
        try {
            const response = await this.rpc.post(
                `/synthesis?speaker=${speaker}&enable_interrogative_upspeak=${enable_interrogative_upspeak}`,
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
