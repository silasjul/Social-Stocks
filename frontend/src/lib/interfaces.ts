import { Timespan } from "./stock-data/polygon";

export interface TimeFrame {
    name: string;
    time: Timespan;
    multiplier: number;
}

export interface Person {
    id: number;
    profileName: string;
    description?: string;
    username: string;
    imgUrl: string;
}

export interface Post {
    personId: number;
    username: string;
    text: string;
    time: string;
    comments: number;
    retweets: number;
    likes: number;
    views: number;
}
