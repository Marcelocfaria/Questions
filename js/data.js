/* ══════════════════════════════════════════════
   StudyRank — Dados: Evolução, Conquistas, Config
   ══════════════════════════════════════════════ */

// URL do Google Apps Script — substitua pela sua
const API_URL = 'https://script.google.com/macros/s/AKfycbwRzYT_BGjI2UqT1AZmGbYphlpFu3fdr9bCUmGqe0WNm3YISTQxNdNo3kERNR-mVMg/exec';

// ──────────────────────────────────────────────
// Cadeia de Evolução — 25 níveis com thresholds progressivos
// ──────────────────────────────────────────────
const EVOLUCAO = [
  // Tier Iniciante — progressão rápida
  { nome: 'Ovo',         emoji: '🥚', req: 0,      tier: 'Iniciante' },
  { nome: 'Minhoca',     emoji: '🪱', req: 30,     tier: 'Iniciante' },
  { nome: 'Formiga',     emoji: '🐜', req: 80,     tier: 'Iniciante' },
  { nome: 'Lagarta',     emoji: '🐛', req: 150,    tier: 'Iniciante' },
  { nome: 'Abelha',      emoji: '🐝', req: 250,    tier: 'Iniciante' },
  { nome: 'Borboleta',   emoji: '🦋', req: 400,    tier: 'Iniciante' },
  { nome: 'Escaravelho', emoji: '🪲', req: 600,    tier: 'Iniciante' },

  // Tier Anfíbio — o despertar
  { nome: 'Girino',      emoji: '🐸', req: 850,    tier: 'Anfíbio' },
  { nome: 'Sapo',        emoji: '🐸', req: 1100,   tier: 'Anfíbio' },
  { nome: 'Tartaruga',   emoji: '🐢', req: 1400,   tier: 'Anfíbio' },
  { nome: 'Iguana',      emoji: '🦎', req: 1800,   tier: 'Anfíbio' },
  { nome: 'Cobra',       emoji: '🐍', req: 2300,   tier: 'Anfíbio' },
  { nome: 'Jacaré',      emoji: '🐊', req: 2900,   tier: 'Anfíbio' },

  // Tier Mamífero — força e agilidade
  { nome: 'Coelho',      emoji: '🐰', req: 3600,   tier: 'Mamífero' },
  { nome: 'Gato',        emoji: '🐈', req: 4400,   tier: 'Mamífero' },
  { nome: 'Cão',         emoji: '🐕', req: 5300,   tier: 'Mamífero' },
  { nome: 'Raposa',      emoji: '🦊', req: 6300,   tier: 'Mamífero' },
  { nome: 'Lobo',        emoji: '🐺', req: 7500,   tier: 'Mamífero' },
  { nome: 'Urso',        emoji: '🐻', req: 8800,   tier: 'Mamífero' },
  { nome: 'Gorila',      emoji: '🦍', req: 10500,  tier: 'Mamífero' },

  // Tier Predador — domínio territorial
  { nome: 'Leopardo',    emoji: '🐆', req: 12500,  tier: 'Predador' },
  { nome: 'Tigre',       emoji: '🐅', req: 15000,  tier: 'Predador' },
  { nome: 'Leão',        emoji: '🦁', req: 18000,  tier: 'Predador' },
  { nome: 'Tubarão',     emoji: '🦈', req: 21500,  tier: 'Predador' },
  { nome: 'Orca',        emoji: '🐋', req: 25500,  tier: 'Predador' },

  // Tier Élite
  { nome: 'Águia',       emoji: '🦅', req: 30000,  tier: 'Élite' },
  { nome: 'Falcão',      emoji: '🪁', req: 35000,  tier: 'Élite' },
  { nome: 'Mamute',      emoji: '🦣', req: 41000,  tier: 'Élite' },
  { nome: 'Dinossauro',  emoji: '🦖', req: 48000,  tier: 'Élite' },

  // Tier Lendário — além do humano
  { nome: 'Unicórnio',   emoji: '🦄', req: 56000,  tier: 'Lendário' },
  { nome: 'Grifo',       emoji: '🦅', req: 65000,  tier: 'Lendário' },
  { nome: 'Fênix',       emoji: '🔥', req: 75000,  tier: 'Lendário' },
  { nome: 'Dragão',      emoji: '🐉', req: 88000,  tier: 'Lendário' },
  { nome: 'Lenda',       emoji: '⚡', req: 105000, tier: 'Lendário' },
  { nome: 'Imortal',     emoji: '👑', req: 130000, tier: 'Lendário' },
];

const TIER_COLORS = {
  'Iniciante': '#6b7aab',
  'Anfíbio':   '#2dd4bf',
  'Mamífero':  '#f59e0b',
  'Predador':  '#f87171',
  'Élite':     '#a89af9',
  'Lendário':  '#f5c842',
};

// ──────────────────────────────────────────────
// Conquistas
// ──────────────────────────────────────────────
const CONQUISTAS = [
  // Volume
  { id: 'primeiro',     icon: '🌱', nome: 'Primeiro Passo',   desc: 'Sua 1ª questão registrada',       cond: u => (u.total||0) >= 1 },
  { id: 'k1',           icon: '🥉', nome: 'Iniciado',         desc: '1.000 questões acumuladas',        cond: u => (u.total||0) >= 1000 },
  { id: 'k5',           icon: '🥈', nome: 'Comprometido',     desc: '5.000 questões acumuladas',        cond: u => (u.total||0) >= 5000 },
  { id: 'k10',          icon: '🥇', nome: 'Mestre',           desc: '10.000 questões acumuladas',       cond: u => (u.total||0) >= 10000 },

  // Consistência (Streak)
  { id: 'streak3',      icon: '🥉', nome: 'Tríade',           desc: '3 dias seguidos estudando',        cond: u => (u.streak||0) >= 3 },
  { id: 'streak7',      icon: '🔥', nome: 'Semana de Fogo',   desc: '7 dias de ofensiva',               cond: u => (u.streak||0) >= 7 },
  { id: 'streak15',     icon: '💎', nome: 'Hábito Formado',   desc: '15 dias de constância',            cond: u => (u.streak||0) >= 15 },
  { id: 'streak30',     icon: '🏛️', nome: 'Inabalável',       desc: '30 dias de foco total',            cond: u => (u.streak||0) >= 30 },

  // Picos diários
  { id: 'burst50',      icon: '🚀', nome: 'Sprint Diário',    desc: 'Fez mais de 50q em um dia',        cond: u => (u.maxDia||0) >= 50 },
  { id: 'burst100',     icon: '☄️', nome: 'Super Nova',       desc: 'Fez mais de 100q em um dia',       cond: u => (u.maxDia||0) >= 100 },

  // Tier Up
  { id: 'rank_anfibio', icon: '🐢', nome: 'Evolução Biológica', desc: 'Saiu do tier Iniciante',         cond: u => (u.total||0) >= 850 },
  { id: 'rank_mamifero',icon: '🦊', nome: 'Sangue Quente',    desc: 'Alcançou o tier Mamífero',         cond: u => (u.total||0) >= 3600 },
];
