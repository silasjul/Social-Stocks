import { Person, Post } from "./interfaces";

/* Dummy data for testing */

const dummyPeople: Person[] = [
    {
        id: 1,
        profileName: "Kekius Maximus",
        username: "@elonmusk",
        description: "",
        imgUrl: "https://pbs.twimg.com/profile_images/1923451603740168192/bBoBROAs_400x400.jpg",
    },
    {
        id: 2,
        profileName: "Donald J. Trump",
        username: "@realDonaldTrump",
        description: "45th & 47th President of the United States of America",
        imgUrl: "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
    },
];
const dummyPosts: Post[] = [
    {
        personId: 2,
        username: "@realDonaldTrump",
        text: "This was so wonderful, 9 years ago today!",
        time: "2025-05-05T15:54:40.000Z",
        comments: 15790,
        retweets: 33815,
        likes: 371853,
        views: 66043801,
    },
    {
        personId: 1,
        username: "@realDonaldTrump",
        text: "Democratic Rep. Jasmine Crockett accused of ‘abusing her power’ at airport after she cut passengers in wheelchairs https://trib.al/Dscc1R8",
        time: "2025-05-06T18:27:37.000Z",
        comments: 2276,
        retweets: 3377,
        likes: 13231,
        views: 2477015,
    },
];

export { dummyPeople, dummyPosts };
