/**
 * Cache imutável em memória para catálogos estáticos
 * @module core/infrastructure/cache/catalog-cache
 */

import type {
  CatalogoBNCC,
  CatalogoBloom,
  CatalogoVirtudes,
} from '../n8n/types';

// ============================================================================
// Interfaces
// ============================================================================

export interface CacheConfig {
  /** Time-to-live em segundos */
  ttl: number;
  /** Tamanho máximo do cache (opcional) */
  maxSize?: number;
  /** Callback quando item é removido */
  onEvict?: (key: string, reason: 'expired' | 'size-limit') => void;
  /** Callback quando item é encontrado */
  onHit?: (key: string) => void;
  /** Callback quando item não é encontrado */
  onMiss?: (key: string) => void;
}

export interface CacheEntry<T> {
  key: string;
  value: T;
  timestamp: number;
  expiresAt: number;
  hits: number;
  metadata?: Record<string, unknown>;
}

export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  estimatedMemoryBytes: number;
  topEntries: Array<{ key: string; hits: number }>;
}

// ============================================================================
// Classe CatalogCache
// ============================================================================

/**
 * Cache genérico para catálogos
 */
export class CatalogCache<T> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private stats = {
    hits: 0,
    misses: 0,
    evictions: 0,
  };

  constructor(private config: CacheConfig) {}

  /**
   * Armazena valor no cache
   */
  set(key: string, value: T, customTTL?: number): void {
    const ttl = customTTL ?? this.config.ttl;
    const now = Date.now();

    // Criar entrada imutável
    const entry: CacheEntry<T> = {
      key,
      value: Object.freeze(value) as T, // Tornar imutável
      timestamp: now,
      expiresAt: now + ttl * 1000,
      hits: 0,
    };

    // Verificar limite de tamanho
    if (this.config.maxSize && this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    // Armazenar
    this.cache.set(key, entry);
  }

  /**
   * Busca valor no cache
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      this.config.onMiss?.(key);
      return null;
    }

    // Verificar expiração
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      this.config.onEvict?.(key, 'expired');
      this.config.onMiss?.(key);
      return null;
    }

    // Cache hit
    entry.hits++;
    this.stats.hits++;
    this.config.onHit?.(key);

    return entry.value;
  }

  /**
   * Verifica se chave existe e não expirou
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Verificar expiração
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.config.onEvict?.(key, 'expired');
      return false;
    }

    return true;
  }

  /**
   * Invalida entrada específica
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalida todo o cache
   */
  invalidateAll(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0 };
  }

  /**
   * Retorna estatísticas do cache
   */
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;

    // Calcular entradas mais acessadas
    const entries = Array.from(this.cache.values())
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 10)
      .map((e) => ({ key: e.key, hits: e.hits }));

    // Estimar tamanho em memória (aproximado)
    const estimatedMemoryBytes = Array.from(this.cache.values()).reduce(
      (acc, entry) => {
        return acc + JSON.stringify(entry.value).length * 2; // UTF-16
      },
      0
    );

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate,
      size: this.cache.size,
      estimatedMemoryBytes,
      topEntries: entries,
    };
  }

  /**
   * Remove entrada menos recentemente usada (LRU)
   */
  private evictLRU(): void {
    let lruKey: string | null = null;
    let lruEntry: CacheEntry<T> | null = null;

    // Encontrar entrada com menor número de hits e mais antiga
    for (const [key, entry] of this.cache.entries()) {
      if (!lruEntry || entry.hits < lruEntry.hits ||
          (entry.hits === lruEntry.hits && entry.timestamp < lruEntry.timestamp)) {
        lruKey = key;
        lruEntry = entry;
      }
    }

    if (lruKey) {
      this.cache.delete(lruKey);
      this.stats.evictions++;
      this.config.onEvict?.(lruKey, 'size-limit');
    }
  }

  /**
   * Serializa cache para JSON
   */
  serialize(): string {
    const data = {
      entries: Array.from(this.cache.entries()),
      stats: this.stats,
      timestamp: Date.now(),
    };
    return JSON.stringify(data);
  }

  /**
   * Restaura cache de JSON
   */
  deserialize(json: string): void {
    try {
      const data = JSON.parse(json);
      this.cache = new Map(data.entries);
      this.stats = data.stats;
    } catch (error) {
      console.error('[CatalogCache] Failed to deserialize cache:', error);
    }
  }
}

// ============================================================================
// Classe EducationalCatalogCache
// ============================================================================

/**
 * Cache especializado para catálogos educacionais
 */
export class EducationalCatalogCache {
  private bnccCache: CatalogCache<CatalogoBNCC>;
  private bloomCache: CatalogCache<CatalogoBloom>;
  private virtuesCache: CatalogCache<CatalogoVirtudes>;

  private hydrated = false;

  constructor(ttlConfig: { bncc: number; bloom: number; virtues: number }) {
    this.bnccCache = new CatalogCache<CatalogoBNCC>({
      ttl: ttlConfig.bncc,
      onHit: (key) => console.debug(`[Cache] BNCC hit: ${key}`),
      onMiss: (key) => console.debug(`[Cache] BNCC miss: ${key}`),
    });

    this.bloomCache = new CatalogCache<CatalogoBloom>({
      ttl: ttlConfig.bloom,
      onHit: (key) => console.debug(`[Cache] Bloom hit: ${key}`),
      onMiss: (key) => console.debug(`[Cache] Bloom miss: ${key}`),
    });

    this.virtuesCache = new CatalogCache<CatalogoVirtudes>({
      ttl: ttlConfig.virtues,
      onHit: (key) => console.debug(`[Cache] Virtues hit: ${key}`),
      onMiss: (key) => console.debug(`[Cache] Virtues miss: ${key}`),
    });
  }

  /**
   * Hidrata cache com catálogos do N8N
   */
  async hydrate(fetchers: {
    fetchBNCC: () => Promise<CatalogoBNCC>;
    fetchBloom: () => Promise<CatalogoBloom>;
    fetchVirtues: () => Promise<CatalogoVirtudes>;
  }): Promise<void> {
    try {
      console.log('[EducationalCatalogCache] Hydrating catalogs...');

      // Buscar catálogos em paralelo
      const [bncc, bloom, virtues] = await Promise.all([
        fetchers.fetchBNCC(),
        fetchers.fetchBloom(),
        fetchers.fetchVirtues(),
      ]);

      // Cachear
      this.bnccCache.set('catalog', bncc);
      this.bloomCache.set('catalog', bloom);
      this.virtuesCache.set('catalog', virtues);

      this.hydrated = true;
      console.log('[EducationalCatalogCache] Catalogs hydrated successfully');
    } catch (error) {
      console.error('[EducationalCatalogCache] Failed to hydrate:', error);
      throw error;
    }
  }

  /**
   * Retorna catálogo BNCC
   */
  getBNCC(): CatalogoBNCC | null {
    return this.bnccCache.get('catalog');
  }

  /**
   * Retorna catálogo Bloom
   */
  getBloom(): CatalogoBloom | null {
    return this.bloomCache.get('catalog');
  }

  /**
   * Retorna catálogo Virtudes
   */
  getVirtues(): CatalogoVirtudes | null {
    return this.virtuesCache.get('catalog');
  }

  /**
   * Invalida todos os catálogos
   */
  invalidateCatalogs(): void {
    this.bnccCache.invalidateAll();
    this.bloomCache.invalidateAll();
    this.virtuesCache.invalidateAll();
    this.hydrated = false;
  }

  /**
   * Verifica se catálogos estão cacheados
   */
  isHydrated(): boolean {
    return (
      this.hydrated &&
      this.bnccCache.has('catalog') &&
      this.bloomCache.has('catalog') &&
      this.virtuesCache.has('catalog')
    );
  }

  /**
   * Retorna estatísticas agregadas
   */
  getStats() {
    return {
      bncc: this.bnccCache.getStats(),
      bloom: this.bloomCache.getStats(),
      virtues: this.virtuesCache.getStats(),
      hydrated: this.hydrated,
    };
  }
}
