import { API_BASE_URL } from '@/config/api';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  bio: string;
  profile_photo: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  project_url: string | null;
  github_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Skill {
  id: number;
  category: SkillCategory;
  skills_list: string[];
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  technologies_used: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfileData {
  user: UserProfile;
  social_links: SocialLink[];
  projects: Project[];
  skills: Skill[];
  work_experience: WorkExperience[];
}

class ApiService {
  private baseUrl: string;
  private userId: number;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.userId = 1; // Default user ID - you can make this configurable
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getProfile(): Promise<ProfileData> {
    return this.request<ProfileData>(`/api/users/${this.userId}/profile/`);
  }

  setUserId(userId: number) {
    this.userId = userId;
  }

  getUserId(): number {
    return this.userId;
  }
}

export const apiService = new ApiService();

