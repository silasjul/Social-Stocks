import { Timespan } from "./stock-data/polygon";

export interface TimeFrame {
    name: string;
    time: Timespan;
    multiplier: number;
}

export interface Person {
    profile_name: string;
    description_text?: string;
    username: string;
    img_url: string;
}

export interface Post {
    text: string;
    time: string;
    comments: number;
    retweets: number;
    likes: number;
    views: number;
}
