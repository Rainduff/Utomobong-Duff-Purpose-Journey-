export type ResumePreset = 'all' | 'ai-research' | 'media-leadership';

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'AI & ML' | 'Research' | 'Creative Media';
  year: string;
  featured: boolean;
  metricBadge?: string;
  scopeBadge?: string;
  description: string;
  impactMetrics: string[];
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  architectureDetails: {
    problem: string;
    solution: string;
    highlights: string[];
  };
}

export interface CareerAchievement {
  text: string;
  focus: Array<'ai-research' | 'media-leadership'>;
}

export interface CareerRole {
  company: string;
  role: string;
  period: string;
  location: string;
  type: string;
  summary: string;
  achievements: CareerAchievement[];
  technologies: string[];
}

export interface ArticleSection {
  heading?: string;
  paragraphs: string[];
  codeBlock?: {
    language: string;
    filename?: string;
    code: string;
  };
  takeaway?: string;
}

export interface ArticleNote {
  id: string;
  title: string;
  publication: string;
  date: string;
  readTime: string;
  excerpt: string;
  tag: string;
  sections: ArticleSection[];
}

export interface CertificationItem {
  title: string;
  issuer: string;
  period: string;
  location?: string;
  pdfUrl?: string;
  notes?: string;
}

export interface RefereeItem {
  name: string;
  organization: string;
  phone: string;
}

export interface ResumeData {
  name: string;
  title: string;
  location: string;
  address: string;
  email: string;
  phones: string[];
  languages: string;
  nationality: string;
  summary: Record<ResumePreset, string>;
  skills: {
    category: string;
    focus: Array<'ai-research' | 'media-leadership'>;
    items: string[];
  }[];
  experience: CareerRole[];
  education: {
    institution: string;
    degree: string;
    period: string;
    notes?: string;
  }[];
  certifications: CertificationItem[];
  projectHighlights: {
    project: string;
    metric: string;
    description: string;
  }[];
  referees: RefereeItem[];
  hobbies: string[];
}

export interface GitHubRepoSummary {
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  url: string;
  updatedAt: string;
}

export interface GitHubSnapshot {
  username: string;
  name: string | null;
  avatarUrl: string | null;
  profileUrl: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  topRepos: GitHubRepoSummary[];
  syncedAt: string;
  source: 'live' | 'cache' | 'unavailable';
}
