export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  profile?: Profile;
}

export interface Profile {
  id: number;
  phone?: string;
  city?: string;
  country?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  avatarUrl?: string;
}

export interface Cv {
  id: number;
  name: string;
  targetCompany?: string;
  jobOfferUrl?: string;
  isDefault: boolean;
  createdAt: string;
  user?: User;
  settings?: {
    id: number;
    template: string;
    language: string;
    accentColor?: string;
    sectionOrder?: string[];
    showPhoto?: boolean;
    showEmail?: boolean;
    showPhone?: boolean;
    showDob?: boolean;
  }[];
}

export interface Technology {
  id: number;
  name: string;
  level: string;
  category?: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  city?: string;
  country?: string;
}

export interface Education {
  id: number;
  school: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  techStack?: string;
  githubUrl?: string;
  liveUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface Language {
  id: number;
  name: string;
  level: string;
}

export interface Bio {
  id: number;
  summary: string;
}

export interface Activity {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export interface Interest {
  id: number;
  name: string;
  description?: string;
}

export interface Link {
  id: number;
  label: string;
  url: string;
  icon?: string;
}
