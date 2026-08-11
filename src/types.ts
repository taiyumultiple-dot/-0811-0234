/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Student {
  id: string;
  name: string;
  avatar: string;
  avatarEmoji: string;
  avatarUrl?: string;
  grade: string;
}

export interface Teacher {
  id: string;
  name: string;
  title: string;
}

export interface Feedback {
  comments: string;
  gradedBy: string;
  gradedAt: string;
  badges: string[]; // e.g. "勇敢追夢中", "思考小高手", "韌性練習中", "未來的自己"
  score?: number; // 1-100
}

export interface QuestFeedback {
  comments: string;
  gradedBy: string;
  gradedAt: string;
}

export interface AutopilotHistory {
  log: string[];
  step: number;
  nickname: string;
  submittedAt?: string;
  feedback?: QuestFeedback;
}

export interface SocratesHistory {
  messages: { role: 'user' | 'model'; text: string }[];
  nickname: string;
  submittedAt?: string;
  feedback?: QuestFeedback;
}

export interface TrolleyHistory {
  selectedConfigId: string;
  reason: string;
  decision: string; // '義務' | '福祉' / custom
  nickname: string;
  submittedAt?: string;
  feedback?: QuestFeedback;
}

export interface FallacyHistory {
  score: number;
  nickname: string;
  submittedAt?: string;
  answers: Record<number, number>; // index to choice index
  feedback?: QuestFeedback;
}

export interface TimelineEvent {
  id: string;
  year?: string;
  text: string;
}

export interface WOOPData {
  wish: string;
  outcome: string;
  obstacle: string;
  plan: string;
  currentStep: number; // 1 to 4
  submitted: boolean;
  submittedAt?: string;
  feedback?: Feedback;
}

export interface ExhibitionData {
  rememberMe: string;
  keywords: string[];
  oneLiner: string;
  timeline: TimelineEvent[];
  submitted: boolean;
  submittedAt?: string;
  feedback?: Feedback;
}

export interface Encouragement {
  id: string;
  senderName: string;
  avatarRole: string; // e.g. "可華爸爸", "可華爺爺"
  avatarEmoji: string;
  avatarUrl?: string;
  text: string;
  likes: number;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  gender: 'M' | 'F';
  relationshipRole: string;
  bio: string;
  tags: string[];
  avatarEmoji: string;
  avatarUrl?: string;
  isFamily?: boolean;
}

export interface StudentSubmission {
  studentId: string;
  studentName: string;
  woop: WOOPData;
  exhibition: ExhibitionData;
  autopilot?: AutopilotHistory;
  socrates?: SocratesHistory;
  trolley?: TrolleyHistory;
  fallacy?: FallacyHistory;
  unitWorksheets?: Record<string, {
    answers: Record<string, any>;
    submitted: boolean;
    submittedAt?: string;
    feedback?: Feedback;
    readingProgress?: number;
  }>;
  games?: Record<string, {
    data: any;
    submittedAt: string;
  }>;
}

export interface UserProfile {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: 'student' | 'teacher';
  avatarEmoji: string;
  avatarUrl?: string;
}

