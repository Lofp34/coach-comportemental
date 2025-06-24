
import { ProfileColor, ProfileTestQuestion, AdaptabilityQuestion, ProfileSheet, ProfileGrid, AssertivenessCategory, ExpressivenessCategory } from './types';
import { UserCircleIcon, ChatBubbleLeftEllipsisIcon, AdjustmentsHorizontalIcon, DocumentTextIcon, SunIcon, BeakerIcon, SparklesIcon, ShieldCheckIcon, LightBulbIcon } from './components/icons';

export const APP_NAME = "Coach Comportemental";

export const PROFILE_COLORS_TW: { [key in ProfileColor]: { bg: string; text: string; border: string; hoverBg: string } } = {
  [ProfileColor.Red]: { bg: 'bg-red-500', text: 'text-red-700', border: 'border-red-500', hoverBg: 'hover:bg-red-600' },
  [ProfileColor.Yellow]: { bg: 'bg-yellow-400', text: 'text-yellow-700', border: 'border-yellow-400', hoverBg: 'hover:bg-yellow-500' },
  [ProfileColor.Green]: { bg: 'bg-green-500', text: 'text-green-700', border: 'border-green-500', hoverBg: 'hover:bg-green-600' },
  [ProfileColor.Blue]: { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-500', hoverBg: 'hover:bg-blue-600' },
};

export const PROFILE_TEST_QUESTIONS: ProfileTestQuestion[] = [
  // Assertiveness Questions (6)
  { id: 'q1', textPositive: 'Prend des décisions rapidement', textNegative: 'Prend du temps pour décider', dimension: 'assertiveness' },
  { id: 'q2', textPositive: 'Direct et franc', textNegative: 'Diplomate et indirect', dimension: 'assertiveness' },
  { id: 'q3', textPositive: 'Focalisé sur les tâches', textNegative: 'Focalisé sur les relations', dimension: 'assertiveness' },
  { id: 'q4', textPositive: 'Compétitif', textNegative: 'Collaboratif', dimension: 'assertiveness' },
  { id: 'q5', textPositive: 'Dit ce qu\'il pense', textNegative: 'Garde ses opinions pour lui', dimension: 'assertiveness' },
  { id: 'q6', textPositive: 'Prend des risques', textNegative: 'Prudent et méthodique', dimension: 'assertiveness' },
  // Expressiveness Questions (6)
  { id: 'q7', textPositive: 'Exprime ouvertement ses émotions', textNegative: 'Contrôle ses émotions', dimension: 'expressiveness' },
  { id: 'q8', textPositive: 'Enthousiaste et animé', textNegative: 'Calme et réservé', dimension: 'expressiveness' },
  { id: 'q9', textPositive: 'Parle beaucoup', textNegative: 'Écoute plus qu\'il ne parle', dimension: 'expressiveness' },
  { id: 'q10', textPositive: 'Orienté vers les gens', textNegative: 'Orienté vers les faits', dimension: 'expressiveness' },
  { id: 'q11', textPositive: 'Spontané', textNegative: 'Planifié', dimension: 'expressiveness' },
  { id: 'q12', textPositive: 'Aime être le centre d\'attention', textNegative: 'Préfère rester en retrait', dimension: 'expressiveness' },
];

export const ADAPTABILITY_QUESTIONS: AdaptabilityQuestion[] = Array.from({ length: 20 }, (_, i) => ({
  id: `aq${i + 1}`,
  text: `Question d'adaptabilité ${i + 1} : Êtes-vous flexible dans cette situation ?` // Placeholder
}));

export const PROFILE_SHEETS_DATA: ProfileSheet[] = [
  {
    profileColor: ProfileColor.Red,
    title: "Profil Rouge (Dominant)",
    icon: SparklesIcon,
    keywords: ["Action", "Résultats", "Défi", "Direct", "Contrôle"],
    timeManagement: "Rapide, focus sur l'immédiat, multitâche.",
    communication: "Direct, concis, orienté solution. Va droit au but.",
    expectations: "Attend compétence, efficacité, et que les autres suivent son rythme.",
    strengths: ["Décisif", "Indépendant", "Leader naturel", "Orienté objectifs"],
    weaknesses: ["Impatient", "Peut être perçu comme insensible", "Peu à l'écoute", "Autoritaire"],
    motivation: "Le pouvoir, les défis, la réussite, la compétition.",
    stressTriggers: ["Perte de contrôle", "Inefficacité", "Indécision des autres", "Routine"],
    tip: "Prenez le temps d'écouter activement et de considérer les sentiments des autres."
  },
  {
    profileColor: ProfileColor.Yellow,
    title: "Profil Jaune (Influent)",
    icon: SunIcon,
    keywords: ["Enthousiasme", "Relationnel", "Optimisme", "Persuasion", "Créativité"],
    timeManagement: "Flexible, focus sur les nouvelles idées, peut se disperser.",
    communication: "Expressif, amical, persuasif. Aime parler et interagir.",
    expectations: "Attend reconnaissance, interactions sociales, liberté d'expression.",
    strengths: ["Charismatique", "Optimiste", "Bon communicant", "Créatif", "Motivant"],
    weaknesses: ["Désorganisé", "Peu attentif aux détails", "Évite les conflits", "Peut manquer de suivi"],
    motivation: "La reconnaissance, l'approbation sociale, le plaisir, la nouveauté.",
    stressTriggers: ["Rejet social", "Routine", "Manque de reconnaissance", "Contraintes"],
    tip: "Structurez vos idées et assurez un suivi rigoureux de vos engagements."
  },
  {
    profileColor: ProfileColor.Green,
    title: "Profil Vert (Stable)",
    icon: BeakerIcon,
    keywords: ["Harmonie", "Soutien", "Coopération", "Patience", "Fiabilité"],
    timeManagement: "Méthodique, focus sur la stabilité, n'aime pas être bousculé.",
    communication: "Calme, à l'écoute, empathique. Recherche le consensus.",
    expectations: "Attend sécurité, appréciation sincère, environnement stable.",
    strengths: ["Fiable", "Patient", "Bon auditeur", "Loyal", "Esprit d'équipe"],
    weaknesses: ["Résistant au changement", "Évite les confrontations", "Indécis", "Peut être trop conciliant"],
    motivation: "La sécurité, l'harmonie, les relations sincères, aider les autres.",
    stressTriggers: ["Conflits", "Changements soudains", "Pression", "Manque d'appréciation"],
    tip: "Exprimez vos propres besoins et n'ayez pas peur de sortir de votre zone de confort."
  },
  {
    profileColor: ProfileColor.Blue,
    title: "Profil Bleu (Consciencieux)",
    icon: ShieldCheckIcon,
    keywords: ["Précision", "Analyse", "Qualité", "Logique", "Organisation"],
    timeManagement: "Planifié, focus sur les détails, respecte les échéances.",
    communication: "Factuel, précis, formel. Pose des questions pour comprendre.",
    expectations: "Attend informations claires, respect des règles, travail de qualité.",
    strengths: ["Analytique", "Organisé", "Rigoureux", "Prudent", "Fiable"],
    weaknesses: ["Perfectionniste", "Peut être critique", "Lent à décider", "Distant"],
    motivation: "La qualité, la précision, la logique, les faits, la compétence.",
    stressTriggers: ["Travail de mauvaise qualité", "Manque d'information", "Chaos", "Critique de son travail"],
    tip: "Soyez plus flexible et ouvert aux idées des autres, même si elles manquent de rigueur initiale."
  }
];

// Annexe A: Grille de Calcul des Profils
// D (Très faible), C (Faible), B (Forte), A (Très forte) pour l'Affirmation
// 1 (Très faible), 2 (Faible), 3 (Forte), 4 (Très forte) pour l'Expressivité
export const PROFILE_GRID: ProfileGrid = {
  '1': { // Expressivité très faible
    'D': `${ProfileColor.Blue} / ${ProfileColor.Blue}`,
    'C': `${ProfileColor.Blue} / ${ProfileColor.Red}`,
    'B': `${ProfileColor.Red} / ${ProfileColor.Blue}`,
    'A': `${ProfileColor.Red} / ${ProfileColor.Red}`,
  },
  '2': { // Expressivité faible
    'D': `${ProfileColor.Blue} / ${ProfileColor.Green}`,
    'C': `${ProfileColor.Blue} / ${ProfileColor.Yellow}`,
    'B': `${ProfileColor.Red} / ${ProfileColor.Green}`,
    'A': `${ProfileColor.Red} / ${ProfileColor.Yellow}`,
  },
  '3': { // Expressivité forte
    'D': `${ProfileColor.Green} / ${ProfileColor.Blue}`,
    'C': `${ProfileColor.Green} / ${ProfileColor.Red}`, // Adjusted from original OCR which had Vert/Rouge
    'B': `${ProfileColor.Yellow} / ${ProfileColor.Blue}`,
    'A': `${ProfileColor.Yellow} / ${ProfileColor.Red}`,
  },
  '4': { // Expressivité très forte
    'D': `${ProfileColor.Green} / ${ProfileColor.Green}`,
    'C': `${ProfileColor.Green} / ${ProfileColor.Yellow}`,
    'B': `${ProfileColor.Yellow} / ${ProfileColor.Green}`,
    'A': `${ProfileColor.Yellow} / ${ProfileColor.Yellow}`,
  },
};

export const getAssertivenessCategory = (sum: number): AssertivenessCategory => {
  if (sum <= 9) return 'D'; // 6-9
  if (sum <= 14) return 'C'; // 10-14
  if (sum <= 19) return 'B'; // 15-19
  return 'A'; // 20-24
};

export const getExpressivenessCategory = (sum: number): ExpressivenessCategory => {
  if (sum <= 9) return '1'; // 6-9
  if (sum <= 14) return '2'; // 10-14
  if (sum <= 19) return '3'; // 15-19
  return '4'; // 20-24
};

export const MOCK_USER_ID = "currentUser";

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

export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';
