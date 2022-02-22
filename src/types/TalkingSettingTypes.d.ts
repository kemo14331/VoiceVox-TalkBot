type UserData = {
    speakerId: number;
};

type TalkingSetting = {
    guildid: string;
    users: UserData[];
};

export { TalkingSetting, UserData };
