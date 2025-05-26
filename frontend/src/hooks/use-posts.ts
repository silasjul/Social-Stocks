import { Post } from "@/lib/interfaces";
import axios from "axios";
import { useState, useEffect } from "react";

export function usePosts() {
    const postsURL = process.env.DATA_URL || "http://localhost:8080";
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        setIsLoading(true);
        setError(undefined);
        try {
            const res = await axios.get(`${postsURL}/posts`);
            const data = res.data as Post[];
            setPosts(data);
        } catch (err: any) {
            setError(err);
            console.error("Error fetching posts: " + err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const addPost = (p: Post) => {
        setPosts((prev) => [...prev, p]);
        axios.post(postsURL, {
            text: p.text,
            time: p.time,
            comments: p.comments,
            retweets: p.retweets,
            likes: p.likes,
            views: p.views,
        });
    };

    return { posts, isLoading, error, addPost, fetchPosts };
}
