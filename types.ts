import type { FC, SVGProps } from 'react';
import { User } from "@supabase/supabase-js";

export type ProfileColor = "Rouge" | "Jaune" | "Vert" | "Bleu";

export type DominantSecondaryProfile = `${ProfileColor} / ${ProfileColor}`;

export interface SavedProfile {
  id: string;
  name: string;
  profileResult: ProfileColor[];
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

// export interface ProfileTestQuestion {
//   id: string;
//   textPositive: string;
//   textNegative: string;
//   dimension: 'assertiveness' | 'expressiveness';
// }

// export interface AdaptabilityQuestion {
//   id: string;
//   text: string;
// }

export interface ProfileSheet {
  profileColor: ProfileColor;
  title: string;
  keywords: string[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  communicationTips: string[];
}

export type AssertivenessCategory = 'D' | 'C' | 'B' | 'A';
export type ExpressivenessCategory = '1' | '2' | '3' | '4';

// For Annex A grid
export interface ProfileGrid {
  [key: string]: { // ExpressivenessCategory as string key
    [key: string]: DominantSecondaryProfile; // AssertivenessCategory as string key
  };
}

// Profile stored in the 'profiles' table, linked to a Supabase user
export interface UserProfile {
  id: string; // Corresponds to Supabase user ID
  username?: string;
  fullName?: string;
  avatarUrl?: string;
  profileResult?: ProfileColor[]; // Array of colors
  adaptabilityScore?: number;
}

// For profiles of other people saved by the user
// This might become its own table later
export interface SavedProfile {
  id: string; // Could be a UUID generated locally or by the DB
  name: string;
  profileResult: ProfileColor[];
  notes?: string;
  // This is no longer managed here, but in the context of the primary user
  // isPrimaryUser: boolean; 
}

export interface Question {
  id: number;
  text: string;
  choices: {
    [key in ProfileColor]: string;
  };
}

// This replaces the old context type
export interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  userProfile: UserProfile | null;
  adaptabilityScore: number | null;
  savedProfiles: SavedProfile[];
  isLoading: boolean;
  setAdaptabilityScore: React.Dispatch<React.SetStateAction<number | null>>;
  setSavedProfiles: React.Dispatch<React.SetStateAction<SavedProfile[]>>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  // Note: Most setters are now handled via Supabase calls within the context
  // or other components, so they are not exposed here.
}

// --- Types for Profile Test ---

export type Profile = {
  id: string;
  updated_at: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  profile_result: string[];
};

export type TestQuestion = {
  id: number;
  created_at: string;
  text_left: string;
  text_right: string;
  dimension: 'affirmation' | 'expression';
  order: number;
};

export type TestAnswer = {
  id: number;
  created_at: string;
  result_id: number;
  question_id: number;
  answer_value: number;
};

export type TestResult = {
  id: string;
  created_at: string;
  user_id: string;
  profile_name: string;
  is_primary: boolean;
  assertiveness_score: number;
  expressiveness_score: number;
  assertiveness_category: 'direct' | 'indirect';
  expressiveness_category: 'réservé' | 'expansif';
  final_profile: string[];
};

// --- Types for Adaptability Test ---

export interface AdaptabilityQuestion {
  id: number;
  text: string;
  order: number;
  correct_answer: boolean;
}

export interface AdaptabilityResult {
  id: string; // UUID
  user_id: string;
  created_at: string;
  score: number;
  notes?: string;
}
