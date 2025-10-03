/**
 * Biblioteca de Ícones Educacionais VirtuQuest
 *
 * Mapeamento semântico de ícones lucide-react para contexto pedagógico
 * conforme seção 11.9 do Specs.md
 */

import {
  BookOpen,
  Target,
  Brain,
  Lightbulb,
  Wrench,
  Search,
  Scale,
  Sparkles,
  Eye,
  Heart,
  Zap,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Award,
  Star,
  Calendar,
  BookMarked,
  GraduationCap,
  type LucideIcon,
} from 'lucide-react';

// ========================================
// MAPEAMENTO DE ÍCONES BNCC
// ========================================

export const BNCCIcons = {
  competencia: BookOpen,
  habilidade: Target,
  objetoConhecimento: BookMarked,
} as const;

// ========================================
// MAPEAMENTO DE ÍCONES BLOOM
// ========================================

export const BloomIcons = {
  lembrar: Brain, // Memória, recordação
  entender: Lightbulb, // Compreensão, insight
  aplicar: Wrench, // Aplicação prática
  analisar: Search, // Análise, investigação
  avaliar: Scale, // Julgamento, avaliação
  criar: Sparkles, // Criação, inovação
} as const;

// ========================================
// MAPEAMENTO DE ÍCONES DE VIRTUDES
// ========================================

export const VirtueIcons = {
  curiosidade: Eye, // Observação, investigação
  humildade: Heart, // Humildade intelectual
  coragem: Zap, // Coragem para questionar
  autonomia: Users, // Independência intelectual
  perseveranca: TrendingUp, // Persistência no aprendizado
  honestidade: CheckCircle, // Honestidade intelectual
} as const;

// ========================================
// MAPEAMENTO DE ÍCONES DE STATUS
// ========================================

export const StatusIcons = {
  RASCUNHO: FileText,
  EM_REVISAO: Clock,
  PENDENTE_APROVACAO: AlertCircle,
  APROVADO: CheckCircle,
  BLOQUEADO: XCircle,
  PUBLICADO: Award,
} as const;

// ========================================
// MAPEAMENTO DE ÍCONES GERAIS
// ========================================

export const GeneralIcons = {
  planoAula: FileText,
  avaliacao: Scale,
  calendario: Calendar,
  professor: GraduationCap,
  turma: Users,
  progresso: TrendingUp,
  conquista: Star,
} as const;

// ========================================
// TIPOS AUXILIARES
// ========================================

export type BNCCIconType = keyof typeof BNCCIcons;
export type BloomIconType = keyof typeof BloomIcons;
export type VirtueIconType = keyof typeof VirtueIcons;
export type StatusIconType = keyof typeof StatusIcons;
export type GeneralIconType = keyof typeof GeneralIcons;

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Retorna ícone para nível Bloom
 */
export function getBloomIcon(nivel: BloomIconType): LucideIcon {
  return BloomIcons[nivel];
}

/**
 * Retorna ícone para virtude intelectual
 */
export function getVirtueIcon(virtude: VirtueIconType): LucideIcon {
  return VirtueIcons[virtude];
}

/**
 * Retorna ícone para status de plano
 */
export function getStatusIcon(status: StatusIconType): LucideIcon {
  return StatusIcons[status];
}

/**
 * Retorna ícone para contexto BNCC
 */
export function getBNCCIcon(tipo: BNCCIconType): LucideIcon {
  return BNCCIcons[tipo];
}

// ========================================
// COMPONENTE WRAPPER (OPCIONAL)
// ========================================

interface EducationalIconProps {
  type: 'bncc' | 'bloom' | 'virtue' | 'status' | 'general';
  name: string;
  className?: string;
  size?: number;
}

/**
 * Componente wrapper para ícones educacionais
 */
export function EducationalIcon({ type, name, className, size = 16 }: EducationalIconProps) {
  let Icon: LucideIcon | undefined;

  switch (type) {
    case 'bncc':
      Icon = BNCCIcons[name as BNCCIconType];
      break;
    case 'bloom':
      Icon = BloomIcons[name as BloomIconType];
      break;
    case 'virtue':
      Icon = VirtueIcons[name as VirtueIconType];
      break;
    case 'status':
      Icon = StatusIcons[name as StatusIconType];
      break;
    case 'general':
      Icon = GeneralIcons[name as GeneralIconType];
      break;
  }

  if (!Icon) {
    return <FileText className={className} size={size} />;
  }

  return <Icon className={className} size={size} />;
}
