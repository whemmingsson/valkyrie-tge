export enum Who {
    Player = "Player",
    Server = "Server"
}

export interface Message {
    who: Who;
    text: string;
}