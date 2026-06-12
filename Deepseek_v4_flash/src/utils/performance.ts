export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

export const IMAGE_CONFIG = {
  lazyLoading: true,
  placeholderUrl: '/placeholder.png',
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 300, height: 300 },
    medium: { width: 600, height: 600 },
    large: { width: 1200, height: 1200 },
  },
};

export const CACHE_CONFIG = {
  cartExpirationDays: 7,
  apiCacheDurationMs: 5 * 60 * 1000,
  translationCacheDurationMs: 365 * 24 * 60 * 60 * 1000,
};

class ApiCache {
  private cache: Map<string, { data: any; timestamp: number }>;
  private ttlMs: number;

  constructor(ttlMs: number) {
    this.ttlMs = ttlMs;
    this.cache = new Map();
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.ttlMs) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

export const apiCache = new ApiCache(CACHE_CONFIG.apiCacheDurationMs);

export function getLazyImageProps(src: string, alt: string, size?: keyof typeof IMAGE_CONFIG.sizes) {
  const dimensions = size ? IMAGE_CONFIG.sizes[size] : undefined;
  return {
    src,
    alt,
    loading: 'lazy' as const,
    width: dimensions?.width,
    height: dimensions?.height,
    decoding: 'async' as const,
  };
}
