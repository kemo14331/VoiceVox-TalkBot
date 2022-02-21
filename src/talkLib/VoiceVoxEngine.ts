import axios, { AxiosResponse } from 'axios';
import { AudioQuery, Preset, Speaker, SpeakerInfo } from '../types/IVoiceVoxEngineTypes';

const serverURL = 'http://localhost:50021';

const rpc = axios.create({ baseURL: serverURL, proxy: false });

export type GetSpeakerInfoOption = {
    speaker_uuid: string;
};

export type AudioQueryOption = {
    text: string;
    speaker: number;
};

export type AudioQueryFromPresetOption = {
    text: string;
    preset_id: number;
};

export type SynthesisOption = {
    query: AudioQuery;
    speaker: number;
    enable_interrogative_upspeak?: boolean;
};

export class VoiceVoxEngine {
    async isReady(): Promise<boolean> {
        try {
            const response = await rpc.get('version');
            return response.status == 200;
        } catch {
            return false;
        }
    }

    async getVersion(): Promise<string | null> {
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

    async getSpeakers(): Promise<Speaker[] | null> {
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

    async getSpeakerInfo(options: GetSpeakerInfoOption): Promise<SpeakerInfo | null> {
        try {
            const response: AxiosResponse<SpeakerInfo> = await rpc.get('speaker_info', {
                params: { speaker_uuid: options.speaker_uuid },
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

    async getAudioQuery(options: AudioQueryOption): Promise<AudioQuery | null> {
        try {
            const response = await rpc.post(`/audio_query?text=${encodeURI(options.text)}&speaker=${options.speaker}`);
            if (response.status == 200) {
                return response.data;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    }

    async getAudioQueryFromPreset(options: AudioQueryFromPresetOption): Promise<AudioQuery | null> {
        try {
            const response = await rpc.post(
                `/audio_query_from_preset?text=${encodeURI(options.text)}&preset_id=${options.preset_id}`
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

    async Synthesis(options: SynthesisOption): Promise<Buffer | null> {
        try {
            if (!options.enable_interrogative_upspeak) options.enable_interrogative_upspeak = true;
            const response = await rpc.post(
                `/synthesis?speaker=${options.speaker}&enable_interrogative_upspeak=${options.enable_interrogative_upspeak}`,
                JSON.stringify(options.query),
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
