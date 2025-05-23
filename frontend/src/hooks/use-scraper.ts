import { Person } from "@/lib/interfaces";
import axios from "axios";
import { useState, useCallback } from "react";

export function useScraper() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const scrapeProfile = useCallback(async (username: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await axios.get(
                `http://localhost:8000/twitter/profile/${username}`
            );
            return res.data as Person;
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { isLoading, error, scrapeProfile };
}
