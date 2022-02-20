/**
 * Preset settings held by the engine.
 */
type Preset = {
    /** ID of preset. */
    id: number;
    /** Name of preset. */
    name: string;
    /** UUID of speaker. */
    speaker_uuid: string;
    /** ID of style. */
    style_id: number;
    /** Speed of speech. */
    speedScale: number;
    /** Pitch of sound. */
    pitchScale: number;
    /** Intonation of speach. */
    intonationScale: number;
    /** Volume of speach. */
    volumeScale: number;
    /** Silence time before speech. */
    prePhonemeLength: number;
    /** Silence time after the sound. */
    postPhonemeLength: number;
};

/**
 * Style of speaker.
 */
type SpeakerStyle = {
    /** Name of speaker. */
    name: string;
    /** ID of speaker. */
    id: number;
};

/**
 * Speaker of VoiceVox.
 */
type Speaker = {
    /** Name of speaker. */
    name: string;
    /** UUID of speaker. */
    speaker_uuid: string;
    /** Array of speakerstyles. */
    styles: SpeakerStyle[];
    /** Version of speaker */
    version?: string;
};

/**
 * Information about the speakerstyle.
 */
type StyleInfo = {
    /** ID of style. */
    id: number;
    /** Base64-encoded icon of the style in question. */
    icon: string;
    /** Base64-encoded wav file of voice_sample. */
    voice_samples: string[];
};

/**
 * Information about the specified speaker_uuid.
 */
type SpeakerInfo = {
    /** policy.md */
    policy: string;
    /** portrait.png with base64-encoding. */
    portrait: string;
    /** Additional information on style. */
    style_infos: StyleInfo;
};

/**
 * Mora of accent.
 */
type Mora = {
    /** Text of mora. */
    text: string;
    /** Consonant phoneme. */
    consonant?: string;
    /** Consonant length. */
    consonant_length?: number;
    /** Vowel phoneme. */
    vowel: string;
    /** Vowel length.  */
    vowel_length: number;
    /** Pitch of mora */
    pitch: number;
};

/**
 * Accent phrases for speech synthesis.
 */
type AccentPhrase = {
    /** Array of moras. */
    moras: Mora[];
    /** Accent location. */
    accent: number;
    /** Whether to add silence in the background. (Information by mora) */
    pause_mora?: Mora[];
    /** Interrogative or not. */
    is_interrogative?: boolean;
};

/**
 * Query for speech synthesis.
 */
type SynthesisQuery = {
    /** Array of AccentPhrase. */
    accent_phrases: AccentPhrase[];
    /** Speed of speech. */
    speedScale: number;
    /** Pitch of sound. */
    pitchScale: number;
    /** Intonation of speach. */
    intonationScale: number;
    /** Volume of speach. */
    volumeScale: number;
    /** Silence time before speech. */
    prePhonemeLength: number;
    /** Silence time after the sound. */
    postPhonemeLength: number;
    /** Output sampling rate of audio data. */
    outputSamplingRate: number;
    /** Whether or not to output audio data in stereo. */
    outputStereo: boolean;
    /** AquesTalk-like reading pseudonyms. Ignored for text-to-speech queries. */
    kana: string;
};

export { Preset, SpeakerStyle, Speaker, StyleInfo, SpeakerInfo, Mora, AccentPhrase, SynthesisQuery };
