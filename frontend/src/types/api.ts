export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
}

export interface Cv {
  id: number;
  name: string;
  targetCompany?: string;
  jobOfferUrl?: string;
  isDefault: boolean;
  createdAt: string;
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
