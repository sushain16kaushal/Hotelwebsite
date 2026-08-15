
import { useState, useEffect } from "react";
import type { ContentData } from "../types/content";

// Cache kitni der tak valid rahegi (5 minutes)
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
    data: ContentData;
    timestamp: number;
}

const getCachedData = (url: string): ContentData | null => {
    try {
        const cacheKey = `cache_${url}`;
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const entry: CacheEntry = JSON.parse(cached);
        const isExpired = Date.now() - entry.timestamp > CACHE_TTL_MS;

        if (isExpired) {
            localStorage.removeItem(cacheKey);
            return null;
        }
        return entry.data;
    } catch {
        return null;
    }
};

const setCachedData = (url: string, data: ContentData) => {
    try {
        const cacheKey = `cache_${url}`;
        const entry: CacheEntry = { data, timestamp: Date.now() };
        localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch {
        // localStorage full ho toh ignore karo
    }
};

const useFetchcontent = (url: string) => {
    // Cache se turant data load karo — loading screen nahi dikhegi!
    const [data, setData] = useState<ContentData | null>(() => getCachedData(url));
    const [loading, setLoading] = useState<boolean>(() => getCachedData(url) === null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchdata = async () => {
            // Agar cache hai toh loading nahi dikhayenge, background mein refresh karenge
            const hasCachedData = getCachedData(url) !== null;
            if (!hasCachedData) setLoading(true);

            try {
                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error('network response is not ok');
                }
                const result = await response.json();
                setData(result);
                setCachedData(url, result); // Cache mein save karo
                setError(null);
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log("Fetch Aborted");
                } else {
                    // Agar network error aaye aur cache hai toh error mat dikhao
                    if (!getCachedData(url)) {
                        setError(err.message);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchdata();
        return () => {
            controller.abort();
        };
    }, [url]);

    return { data, loading, error };
};

export default useFetchcontent;