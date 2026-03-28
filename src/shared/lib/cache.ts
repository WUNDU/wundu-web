/**
 * Client-side cache utility for API requests
 * Provides in-memory caching with TTL support
 */

export const CACHE_TAGS = {
    GOALS: 'goals',
    TRANSACTIONS: 'transactions',
    CATEGORIES: 'categories',
    USER: 'user',
} as const;

type CacheEntry<T> = {
    data: T;
    timestamp: number;
};

class ClientCache {
    private cache: Map<string, CacheEntry<any>> = new Map();
    private defaultTTL: number = 60000; // 60 seconds default

    /**
     * Get data from cache if valid
     */
    get<T>(key: string, ttl?: number): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        const cacheTTL = ttl ?? this.defaultTTL;
        const isValid = Date.now() - entry.timestamp < cacheTTL;

        if (!isValid) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    /**
     * Set data in cache
     */
    set<T>(key: string, data: T): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    /**
     * Invalidate specific cache key
     */
    invalidate(key: string): void {
        this.cache.delete(key);
    }

    /**
     * Invalidate all cache entries matching a tag
     */
    invalidateByTag(tag: string): void {
        const keysToDelete: string[] = [];
        this.cache.forEach((_, key) => {
            if (key.startsWith(`${tag}:`)) {
                keysToDelete.push(key);
            }
        });
        keysToDelete.forEach(key => this.cache.delete(key));
    }

    /**
     * Clear all cache
     */
    clear(): void {
        this.cache.clear();
    }

    /**
     * Get cache stats
     */
    getStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
        };
    }
}

// Singleton instance
export const cache = new ClientCache();

/**
 * Wrapper function to cache async function results
 * @param fn - The async function to cache
 * @param cacheKey - Unique cache key
 * @param options - Cache options
 */
export async function withCache<T>(
    fn: () => Promise<T>,
    cacheKey: string,
    options?: {
        ttl?: number;
        tag?: string;
    }
): Promise<T> {
    // Try to get from cache
    const cached = cache.get<T>(cacheKey, options?.ttl);
    if (cached !== null) {
        return cached;
    }

    // Fetch fresh data
    const data = await fn();

    // Store in cache
    cache.set(cacheKey, data);

    return data;
}

/**
 * Create a cached version of a service method
 */
export function createCachedMethod<T extends (...args: any[]) => Promise<any>>(
    method: T,
    options: {
        keyPrefix: string;
        ttl?: number;
        tag?: string;
    }
): T {
    return (async (...args: any[]) => {
        const cacheKey = `${options.keyPrefix}:${JSON.stringify(args)}`;
        return withCache(() => method(...args), cacheKey, {
            ttl: options.ttl,
            tag: options.tag,
        });
    }) as T;
}
