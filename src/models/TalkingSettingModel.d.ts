interface UserData {
    speakerId: number;
}

interface TalkingSetting {
    guildid: string;
    users: UserData[];
}

export { TalkingSetting, UserData };
