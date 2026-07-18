export interface Bilingual<T = string> {
  zh: T;
  en: T;
}

export interface Project {
  id: string;
  title: Bilingual;
  description: Bilingual;
  category: 'chip' | 'ai' | 'frontend';
  tags: string[];
  links: {
    github?: string;
    demo?: string;
  };
  featured: boolean;
}

export interface Experience {
  type: 'education' | 'research' | 'internship' | 'activity';
  title: Bilingual;
  organization: Bilingual;
  date: string;
  description: Bilingual;
}

export interface TechCategory {
  key: string;
  name: Bilingual;
  items: { name: string }[];
}

export interface NavItem {
  id: string;
  label: Bilingual;
}

// --- Academic layout types ---

export interface SocialLinks {
  google_scholar?: string;
  orcid?: string;
  github?: string;
  linkedin?: string;
}

export interface Profile {
  name: Bilingual;
  title: Bilingual;
  affiliation?: Bilingual;
  location: string;
  email: string;
  social: SocialLinks;
  research_interests: Bilingual<string[]>;
  avatar_initials: string;
}

export interface Publication {
  id: string;
  title: Bilingual;
  authors: string[];
  journal: Bilingual;
  year: number;
  description: Bilingual;
  link?: string;
  doi?: string;
  featured: boolean;
}
