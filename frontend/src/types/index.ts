// Shared TypeScript type definitions for ATSense

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  responsibilities: string[];
  achievements?: string[];
  location?: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  gpa?: string;
  achievements?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
}

export interface Resume {
  id: string; // Changed from _id for SQL
  user: string;
  title: string;
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  certifications?: Certification[];
  projects?: Project[];
  languages?: string[];
  atsScore: number;
  jobDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ATSBreakdown {
  overallScore: number;
  breakdown: {
    [key: string]: {
      score: number;
      weight: number;
      max: number;
    };
  };
  missingKeywords: string[];
  matchedKeywords: string[];
  issues: string[];
  recommendations: string[];
}

export interface JobMatchResult {
  score: number;
  missingKeywords: string[];
  matchingKeywords: string[];
  summary: string;
}

export interface CoverLetter {
  id: string; // Changed from _id for SQL
  user: string;
  resumeId: string;
  jobTitle: string;
  companyName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string; // Changed from _id for SQL
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}
