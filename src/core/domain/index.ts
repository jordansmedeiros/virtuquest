/**
 * Camada de Domínio Pedagógico - VirtuQuest
 *
 * Exporta todos os agregados pedagógicos:
 * - BNCC (Base Nacional Comum Curricular)
 * - Bloom (Taxonomia Revisada)
 * - Perrenoud (Teoria das Competências)
 * - Virtudes Intelectuais
 * - Tipos e Utilitários Compartilhados
 *
 * Implementação baseada em Domain-Driven Design:
 * - Modelos imutáveis
 * - Repositórios estáticos com dados seed
 * - Separação por agregados
 * - Alinhamento com fundamentos pedagógicos
 *
 * @see docs/development/SPECS.md (seções 1.1-1.4)
 * @see docs/fundamentos/
 */

// Agregado BNCC
export * from './bncc';

// Agregado Bloom
export * from './bloom';

// Agregado Perrenoud
export * from './perrenoud';

// Agregado Virtudes
export * from './virtudes';

// Tipos Compartilhados
export * from './shared';
