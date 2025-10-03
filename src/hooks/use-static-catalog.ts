/**
 * Hook React para acessar catálogos estáticos cacheados
 * @module hooks/use-static-catalog
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { n8nClient } from '@/core/infrastructure/n8n';
import type {
  CatalogoBNCC,
  CatalogoBloom,
  CatalogoVirtudes,
  CompetenciaBNCC,
  HabilidadeBNCC,
  NivelBloom,
  VirtudeIntelectual,
} from '@/core/infrastructure/n8n';

// ============================================================================
// Interfaces
// ============================================================================

export interface UseStaticCatalogResult<T> {
  /** Dados do catálogo */
  catalog: T | null;
  /** Indicador de carregamento */
  isLoading: boolean;
  /** Indicador de erro */
  isError: boolean;
  /** Erro ocorrido */
  error: Error | null;
  /** Função para recarregar catálogo */
  refetch: () => Promise<void>;
  /** Função para invalidar cache */
  invalidate: () => void;
}

// ============================================================================
// Hook Genérico
// ============================================================================

/**
 * Hook genérico para acessar catálogos estáticos
 */
function useStaticCatalog<T>(
  catalogType: 'bncc' | 'bloom' | 'virtues',
  options?: {
    autoFetch?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): UseStaticCatalogResult<T> {
  const [catalog, setCatalog] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let data: T;

      // Buscar catálogo apropriado
      switch (catalogType) {
        case 'bncc':
          data = (await n8nClient.fetchBNCCCatalog()) as T;
          break;
        case 'bloom':
          data = (await n8nClient.fetchBloomCatalog()) as T;
          break;
        case 'virtues':
          data = (await n8nClient.fetchVirtuesCatalog()) as T;
          break;
      }

      setCatalog(data);
      options?.onSuccess?.(data);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [catalogType, options]);

  const invalidate = useCallback(() => {
    // Invalidar cache do n8nClient primeiro
    switch (catalogType) {
      case 'bncc':
        n8nClient.invalidateBNCCCatalog();
        break;
      case 'bloom':
        n8nClient.invalidateBloomCatalog();
        break;
      case 'virtues':
        n8nClient.invalidateVirtuesCatalog();
        break;
    }

    // Limpar estado local
    setCatalog(null);
  }, [catalogType]);

  // Effect para auto-fetch
  useEffect(() => {
    if (options?.autoFetch !== false && !catalog) {
      fetchCatalog();
    }
  }, [fetchCatalog, catalog, options?.autoFetch]);

  return {
    catalog,
    isLoading,
    isError: error !== null,
    error,
    refetch: fetchCatalog,
    invalidate,
  };
}

// ============================================================================
// Hooks Especializados
// ============================================================================

/**
 * Hook para acessar catálogo BNCC
 */
export function useBNCCCatalog(options?: {
  autoFetch?: boolean;
  onSuccess?: (data: CatalogoBNCC) => void;
  onError?: (error: Error) => void;
}) {
  return useStaticCatalog<CatalogoBNCC>('bncc', options);
}

/**
 * Hook para acessar catálogo Bloom
 */
export function useBloomCatalog(options?: {
  autoFetch?: boolean;
  onSuccess?: (data: CatalogoBloom) => void;
  onError?: (error: Error) => void;
}) {
  return useStaticCatalog<CatalogoBloom>('bloom', options);
}

/**
 * Hook para acessar catálogo de Virtudes
 */
export function useVirtuesCatalog(options?: {
  autoFetch?: boolean;
  onSuccess?: (data: CatalogoVirtudes) => void;
  onError?: (error: Error) => void;
}) {
  return useStaticCatalog<CatalogoVirtudes>('virtues', options);
}

/**
 * Hook para acessar todos os catálogos
 */
export function useAllCatalogs() {
  const bncc = useBNCCCatalog();
  const bloom = useBloomCatalog();
  const virtues = useVirtuesCatalog();

  return {
    bncc: bncc.catalog,
    bloom: bloom.catalog,
    virtues: virtues.catalog,
    isLoading: bncc.isLoading || bloom.isLoading || virtues.isLoading,
    isError: bncc.isError || bloom.isError || virtues.isError,
    errors: {
      bncc: bncc.error,
      bloom: bloom.error,
      virtues: virtues.error,
    },
    refetchAll: () => {
      bncc.refetch();
      bloom.refetch();
      virtues.refetch();
    },
    invalidateAll: () => {
      bncc.invalidate();
      bloom.invalidate();
      virtues.invalidate();
    },
  };
}

// ============================================================================
// Helpers de Busca
// ============================================================================

/**
 * Hook para buscar competência BNCC específica
 */
export function useBNCCCompetency(codigo: string): CompetenciaBNCC | null {
  const { catalog } = useBNCCCatalog();
  return catalog?.competencias.find((c) => c.codigo === codigo) || null;
}

/**
 * Hook para buscar habilidade BNCC específica
 */
export function useBNCCHabilidade(codigo: string): HabilidadeBNCC | null {
  const { catalog } = useBNCCCatalog();
  return catalog?.habilidades.find((h) => h.codigo === codigo) || null;
}

/**
 * Hook para buscar nível Bloom específico
 */
export function useBloomLevel(nivel: string): NivelBloom | null {
  const { catalog } = useBloomCatalog();
  return catalog?.niveis.find((n) => n.nivel === nivel) || null;
}

/**
 * Hook para buscar virtude específica
 */
export function useVirtue(nome: string): VirtudeIntelectual | null {
  const { catalog } = useVirtuesCatalog();
  return catalog?.virtudes.find((v) => v.nome === nome) || null;
}

/**
 * EXEMPLOS DE USO:
 *
 * // Buscar catálogo BNCC
 * function BNCCSelector() {
 *   const { catalog, isLoading, error } = useBNCCCatalog();
 *
 *   if (isLoading) return <Spinner />;
 *   if (error) return <ErrorMessage error={error} />;
 *
 *   return (
 *     <select>
 *       {catalog?.competencias.map(comp => (
 *         <option key={comp.codigo} value={comp.codigo}>
 *           {comp.codigo} - {comp.descricao}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 *
 * // Buscar competência específica
 * function CompetencyDetails({ codigo }: { codigo: string }) {
 *   const competency = useBNCCCompetency(codigo);
 *
 *   if (!competency) return <NotFound />;
 *
 *   return <div>{competency.descricao}</div>;
 * }
 *
 * // Buscar todos os catálogos
 * function PlannerEditor() {
 *   const { bncc, bloom, virtues, isLoading } = useAllCatalogs();
 *
 *   if (isLoading) return <LoadingScreen />;
 *
 *   return (
 *     <div>
 *       <BNCCSection catalog={bncc} />
 *       <BloomSection catalog={bloom} />
 *       <VirtuesSection catalog={virtues} />
 *     </div>
 *   );
 * }
 */
