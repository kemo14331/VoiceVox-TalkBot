import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Preset, Speaker, SpeakerInfo } from '../types/ITalkEngineTypes';

const serverURL = 'http://localhost:50021';

export class TalkEngine {
    private rpc: AxiosInstance;
    constructor() {
        this.rpc = axios.create({ baseURL: serverURL, proxy: false });
    }

    async isReady(): Promise<boolean> {
        try {
            let response = await this.rpc.get('version');
            return response.status == 200;
        } catch {
            return false;
        }
    }

    async getVersion(): Promise<string | null> {
        try {
            let response = await this.rpc.get('version');
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
            let response: AxiosResponse<Speaker[]> = await this.rpc.get('speakers');
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
            let response: AxiosResponse<SpeakerInfo> = await this.rpc.get('speaker_info', {
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
            let response: AxiosResponse<Preset[]> = await this.rpc.get('presets');
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }
}
