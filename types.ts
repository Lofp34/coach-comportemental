import type { FC, SVGProps } from 'react';

export enum ProfileColor {
  Red = "Rouge",
  Yellow = "Jaune",
  Green = "Vert",
  Blue = "Bleu",
}

export type DominantSecondaryProfile = `${ProfileColor} / ${ProfileColor}`;

export interface SavedProfile {
  id: string;
  name: string;
  profileResult: DominantSecondaryProfile;
  isPrimaryUser: boolean;
  answers?: number[]; // Store answers for review, optional
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface ProfileTestQuestion {
  id: string;
  textPositive: string;
  textNegative: string;
  dimension: 'assertiveness' | 'expressiveness';
}

export interface AdaptabilityQuestion {
  id: string;
  text: string;
}

export interface ProfileSheet {
  profileColor: ProfileColor;
  title: string;
  icon: FC<SVGProps<SVGSVGElement>>;
  keywords: string[];
  timeManagement: string;
  communication: string;
  expectations: string;
  strengths: string[];
  weaknesses: string[];
  motivation: string;
  stressTriggers: string[];
  tip: string;
}

export type AssertivenessCategory = 'D' | 'C' | 'B' | 'A';
export type ExpressivenessCategory = '1' | '2' | '3' | '4';

// For Annex A grid
export interface ProfileGrid {
  [key: string]: { // ExpressivenessCategory as string key
    [key: string]: DominantSecondaryProfile; // AssertivenessCategory as string key
  };
}
