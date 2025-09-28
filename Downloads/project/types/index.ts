export interface GalleryItem {
  id: string;
  userId: string;
  imageUri: string;
  caption: string;
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: string;
  lastActive: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  voiceLanguage: string;
  autoSave: boolean;
  notifications: boolean;
}