"use client";

import { dummyPosts } from "@/lib/dummy-data";
import { Post } from "@/lib/interfaces";
import React, { createContext, useContext, useState } from "react";
import axios from "axios";

interface PostContextProps {
    posts: Post[];
    filteredPosts: Post[];
    scrapePosts: (username: string) => void;
}

const PostContext = createContext<PostContextProps>({
    posts: [],
    filteredPosts: [],
    scrapePosts: () => {},
});

export default function PostProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [posts, setPosts] = useState<Post[]>([...dummyPosts]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([...dummyPosts]);

    const scrapePosts = async (username: string) => {
        const res = await axios.get(
            `http://localhost:8000/twitter/tweets/${username.slice(1)}`
        );
        // All posts
        addPosts(res.data as Post[]);

        // All filtered and sorted posts
        const filtered = filterPosts(res.data as Post[]);
        const allFiltered = [...filteredPosts, ...filtered];
        setFilteredPosts(sortPosts(allFiltered));
    };

    const filterPosts = (new_posts: Post[]) => {
        return new_posts.filter((old_posts) => {
            // Post has no text
            if (!old_posts.text) return false;

            // Already scraped this post
            for (const post of filteredPosts) {
                if (post.time == old_posts.time) return false;
            }
            
            return true;
        });
    };

    const sortPosts = (posts: Post[]) => {
        // Sort by date descending (newest first)
        return posts.sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );
    };
    const addPost = (post: Post) => {
        setPosts([...posts, post]);
    };

    const addPosts = (new_posts: Post[]) => {
        setPosts([...posts, ...new_posts]);
    };

    return (
        <PostContext.Provider value={{ posts, filteredPosts, scrapePosts }}>
            {children}
        </PostContext.Provider>
    );
}

export function usePosts() {
    const { posts, filteredPosts, scrapePosts } = useContext(PostContext);
    return { posts, filteredPosts, scrapePosts };
}
