import { Code, Cloud, Wrench, Github, Linkedin, Instagram, FileText, MessageCircle } from 'lucide-react';

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  tags: string[];
  read_time: number;
  views: number;
  is_featured: boolean;
  published_at: string;
  created_at: string;
}

export type CategoryIcon = typeof Code;
export type SocialIcon = typeof Github;

export const categoryIcons: Record<string, CategoryIcon> = {
  "Backend & APIs": Code,
  "Cloud & DevOps": Cloud,
  "Tools & Technologies": Wrench,
  "Tools & Tech": Wrench,
};

export const socialIcons: Record<string, SocialIcon> = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
  whatsapp: MessageCircle,
  resume: FileText,
};

