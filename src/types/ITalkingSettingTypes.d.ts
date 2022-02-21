interface IUSERDATA {
    speakerId: number;
}

type TalkingSetting = {
    guildid: string;
    users: IUSERDATA[];
};

export { TalkingSetting, IUSERDATA };
