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
