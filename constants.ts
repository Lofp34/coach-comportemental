import { ProfileColor, ProfileSheet } from './types';
import { UserCircleIcon, ChatBubbleLeftEllipsisIcon, AdjustmentsHorizontalIcon, DocumentTextIcon } from './components/icons';

export const APP_NAME = "Coach Comportemental";

export const PROFILE_COLORS_TW: { [key in ProfileColor]: { bg: string; text: string; border: string; hoverBg: string } } = {
  "Rouge": { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-500', hoverBg: 'hover:bg-red-600' },
  "Jaune": { bg: 'bg-yellow-400', text: 'text-yellow-700', border: 'border-yellow-400', hoverBg: 'hover:bg-yellow-500' },
  "Vert": { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-500', hoverBg: 'hover:bg-green-600' },
  "Bleu": { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-500', hoverBg: 'hover:bg-blue-600' },
};

export const PROFILE_SHEETS_DATA: ProfileSheet[] = [
  {
    profileColor: "Rouge",
    title: "Profil Rouge (Dominant)",
    description: "Les individus au profil Rouge sont motivés par le pouvoir et le contrôle. Ils sont directs, décisifs et aiment les défis. Ils se concentrent sur les résultats et prennent des décisions rapidement.",
    keywords: ["Action", "Résultats", "Défi", "Direct", "Contrôle"],
    strengths: ["Décisif", "Indépendant", "Leader naturel", "Orienté objectifs"],
    weaknesses: ["Impatient", "Peut être perçu comme insensible", "Peu à l'écoute", "Autoritaire"],
    communicationTips: [
        "Soyez direct et allez droit au but.",
        "Présentez les informations de manière logique et concise.",
        "Concentrez-vous sur les résultats et les solutions, pas sur les problèmes.",
        "Évitez les conversations trop personnelles ou émotionnelles."
    ]
  },
  {
    profileColor: "Jaune",
    title: "Profil Jaune (Influent)",
    description: "Les profils Jaunes sont sociaux, optimistes et enthousiastes. Ils aiment interagir avec les autres, persuader et être au centre de l'attention. Ils sont créatifs et motivants.",
    keywords: ["Enthousiasme", "Relationnel", "Optimisme", "Persuasion", "Créativité"],
    strengths: ["Charismatique", "Optimiste", "Bon communicant", "Créatif", "Motivant"],
    weaknesses: ["Désorganisé", "Peu attentif aux détails", "Évite les conflits", "Peut manquer de suivi"],
    communicationTips: [
        "Soyez amical, chaleureux et montrez de l'intérêt pour eux.",
        "Laissez-les parler d'eux et de leurs idées.",
        "Soyez expressif et utilisez des histoires ou des exemples.",
        "Évitez d'être trop négatif ou critique."
    ]
  },
  {
    profileColor: "Vert",
    title: "Profil Vert (Stable)",
    description: "Les profils Verts recherchent l'harmonie, la stabilité et la sécurité. Ils sont calmes, patients, fiables et d'excellents auditeurs. Ils préfèrent la coopération à la compétition.",
    keywords: ["Harmonie", "Soutien", "Coopération", "Patience", "Fiabilité"],
    strengths: ["Fiable", "Patient", "Bon auditeur", "Loyal", "Esprit d'équipe"],
    weaknesses: ["Résistant au changement", "Évite les confrontations", "Indécis", "Peut être trop conciliant"],
    communicationTips: [
        "Adoptez une approche calme, douce et patiente.",
        "Montrez une appréciation sincère pour leur travail.",
        "Posez des questions pour connaître leur opinion et écoutez attentivement.",
        "Évitez les changements soudains ou la confrontation directe."
    ]
  },
  {
    profileColor: "Bleu",
    title: "Profil Bleu (Consciencieux)",
    description: "Les profils Bleus sont analytiques, précis et organisés. Ils valorisent la qualité, les faits et la logique. Ils aiment suivre les règles et s'assurer que le travail est bien fait.",
    keywords: ["Précision", "Analyse", "Qualité", "Logique", "Organisation"],
    strengths: ["Analytique", "Organisé", "Rigoureux", "Prudent", "Fiable"],
    weaknesses: ["Perfectionniste", "Peut être critique", "Lent à décider", "Distant"],
    communicationTips: [
        "Fournissez des informations détaillées, précises et factuelles.",
        "Soyez préparé et organisé dans votre approche.",
        "Laissez-leur du temps pour réfléchir et prendre une décision.",
        "Évitez d'être vague ou trop émotif."
    ]
  }
];

export const DEFAULT_AI_WELCOME_MESSAGE = "Bonjour ! Comment puis-je vous aider aujourd'hui à mieux comprendre les dynamiques comportementales ?";
export const DEFAULT_AI_TIP_PREFIX = "Astuce du jour : ";
export const DEFAULT_AI_TIPS = [
    "Pensez à adapter votre communication au profil de votre interlocuteur.",
    "L'écoute active est la clé d'une meilleure compréhension mutuelle.",
    "Chaque profil a ses forces. Apprenez à les valoriser chez vous et chez les autres."
];

export const NAVIGATION_ITEMS = [
  { path: '/coach-ia', label: 'Coach IA', icon: ChatBubbleLeftEllipsisIcon },
  { path: '/test-profil', label: 'Test Profil', icon: UserCircleIcon },
  { path: '/mon-adaptabilite', label: 'Adaptabilité', icon: AdjustmentsHorizontalIcon },
  { path: '/fiches-profils', label: 'Fiches Profils', icon: DocumentTextIcon },
];

export const GEMINI_MODEL_TEXT = 'gemini-1.5-flash-latest';

// --- Test Calculation Logic ---

export type AssertivenessCategory = 'A' | 'B' | 'C' | 'D';
export type ExpressivenessCategory = '1' | '2' | '3' | '4';

// Grid for mapping categories to profiles. Format: [Dominant, Secondary]
export const PROFILE_GRID: Record<ExpressivenessCategory, Record<AssertivenessCategory, [ProfileColor, ProfileColor]>> = {
  '1': { 'D': ["Bleu", "Bleu"],   'C': ["Bleu", "Rouge"],  'B': ["Rouge", "Bleu"],  'A': ["Rouge", "Rouge"] },
  '2': { 'D': ["Bleu", "Vert"],   'C': ["Bleu", "Jaune"],  'B': ["Rouge", "Vert"],  'A': ["Rouge", "Jaune"] },
  '3': { 'D': ["Vert", "Bleu"],   'C': ["Vert", "Rouge"],  'B': ["Jaune", "Bleu"],  'A': ["Jaune", "Rouge"] },
  '4': { 'D': ["Vert", "Vert"],   'C': ["Vert", "Jaune"],  'B': ["Jaune", "Vert"],  'A': ["Jaune", "Jaune"] }
};

export const getAssertivenessCategory = (sum: number): AssertivenessCategory => {
  if (sum >= 21) return 'A'; // 21-24
  if (sum >= 16) return 'B'; // 16-20
  if (sum >= 11) return 'C'; // 11-15
  return 'D'; // 6-10
};

export const getExpressivenessCategory = (sum: number): ExpressivenessCategory => {
  if (sum >= 21) return '4'; // 21-24
  if (sum >= 16) return '3'; // 16-20
  if (sum >= 11) return '2'; // 11-15
  return '1'; // 6-10
};

export const PROFILE_COLORS: { [key: string]: { bg: string; text: string } } = {
    "Rouge": { bg: "bg-red-500", text: "text-white" },
    "Jaune": { bg: "bg-yellow-400", text: "text-gray-800" },
    "Vert": { bg: "bg-green-500", text: "text-white" },
    "Bleu": { bg: "bg-blue-500", text: "text-white" },
};

export const PROFILES_DATA = {
  rouge: {
    id: 'rouge',
    name: 'Profil Rouge (Dominant)',
    keywords: 'Action, Résultats, Défi...',
    bgColor: 'bg-red-400',
    textColor: 'text-white',
    icon: 'ArrowTrendingUpIcon',
    title: 'Profil Rouge (Dominant)',
    fullKeywords: 'Action, Résultats, Défi, Direct, Contrôle',
    sections: {
      'Gestion du temps': 'Rapide, focus sur l\'immédiat, multitâche.',
      'Communication': 'Direct, concis, orienté solution. Va droit au but.',
      'Attentes': 'Attend compétence, efficacité, et que les autres suivent son rythme.',
      'Forces': ['Décisif', 'Indépendant', 'Leader naturel', 'Orienté objectifs'],
      'Points de vigilance': ['Impatient', 'Peut être perçu comme insensible', 'Peu à l\'écoute', 'Autoritaire'],
      'Sources de motivation': 'Le pouvoir, les défis, la réussite, la compétition.',
      'Déclencheurs de stress': 'Perte de contrôle, Inefficacité, Indécision des autres, Routine',
      'Conseil clé': 'Prenez le temps d\'écouter activement et de considérer les sentiments des autres.'
    }
  },
  jaune: {
    id: 'jaune',
    name: 'Profil Jaune (Influent)',
    keywords: 'Enthousiasme, Relationnel, Optimisme...',
    bgColor: 'bg-yellow-400',
    textColor: 'text-gray-800',
    icon: 'SunIcon',
    title: 'Profil Jaune (Influent)',
    fullKeywords: 'Enthousiasme, Relationnel, Optimisme, Persuasion, Créativité',
    sections: {
      'Gestion du temps': 'Flexible, focus sur les nouvelles idées, peut se disperser.',
      'Communication': 'Expressif, amical, persuasif. Aime parler et interagir.',
      'Attentes': 'Attend reconnaissance, interactions sociales, liberté d\'expression.',
      'Forces': ['Charismatique', 'Optimiste', 'Bon communicant', 'Créatif', 'Motivant'],
      'Points de vigilance': ['Désorganisé', 'Peu attentif aux détails', 'Évite les conflits', 'Peut manquer de suivi'],
      'Sources de motivation': 'La reconnaissance, l\'approbation sociale, le plaisir, la nouveauté.',
      'Déclencheurs de stress': 'Rejet social, Routine, Manque de reconnaissance, Contraintes',
      'Conseil clé': 'Structurez vos idées et assurez un suivi rigoureux de vos engagements.'
    }
  },
  vert: {
    id: 'vert',
    name: 'Profil Vert (Stable)',
    keywords: 'Harmonie, Soutien, Coopération...',
    bgColor: 'bg-green-500',
    textColor: 'text-white',
    icon: 'ScaleIcon',
    title: 'Profil Vert (Stable)',
    fullKeywords: 'Harmonie, Soutien, Coopération, Patience, Fiabilité',
    sections: {
      'Gestion du temps': 'Méthodique, focus sur la stabilité, n\'aime pas être bousculé.',
      'Communication': 'Calme, à l\'écoute, empathique. Recherche le consensus.',
      'Attentes': 'Attend sécurité, appréciation sincère, environnement stable.',
      'Forces': ['Fiable', 'Patient', 'Bon auditeur', 'Loyal', 'Esprit d\'équipe'],
      'Points de vigilance': ['Résistant au changement', 'Évite les confrontations', 'Indécis', 'Peut être trop conciliant'],
      'Sources de motivation': 'La sécurité, l\'harmonie, les relations sincères, aider les autres.',
      'Déclencheurs de stress': 'Conflits, Changements soudains, Pression, Manque d\'appréciation',
      'Conseil clé': 'Exprimez vos propres besoins et n\'ayez pas peur de sortir de votre zone de confort.'
    }
  },
  bleu: {
    id: 'bleu',
    name: 'Profil Bleu (Consciencieux)',
    keywords: 'Précision, Analyse, Qualité...',
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    icon: 'ShieldCheckIcon',
    title: 'Profil Bleu (Consciencieux)',
    fullKeywords: 'Précision, Analyse, Qualité, Logique, Organisation',
    sections: {
      'Gestion du temps': 'Planifié, focus sur les détails, respecte les échéances.',
      'Communication': 'Factuel, précis, formel. Pose des questions pour comprendre.',
      'Attentes': 'Attend informations claires, respect des règles, travail de qualité.',
      'Forces': ['Analytique', 'Organisé', 'Rigoureux', 'Prudent', 'Fiable'],
      'Points de vigilance': ['Perfectionniste', 'Peut être critique', 'Lent à décider', 'Distant'],
      'Sources de motivation': 'La qualité, la précision, la logique, les faits, la compétence.',
      'Déclencheurs de stress': 'Travail de mauvaise qualité, Manque d\'information, Chaos, Critique de son travail',
      'Conseil clé': 'Soyez plus flexible et ouvert aux idées des autres, même si elles manquent de rigueur initiale.'
    }
  }
};
