import type { Timestamp } from "firebase/firestore";

export type JobDate =
  | Timestamp
  | Date
  | string
  | { seconds?: number; nanoseconds?: number }
  | null;

export interface Company {
  id: string;
  name: string;
  logo_url?: string;
  website?: string;
  email?: string;
  phone?: string;
  location?: string;
  description?: string;
  created_at?: JobDate;
  updated_at?: JobDate;
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  created_at?: JobDate;
  updated_at?: JobDate;
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  requirements?: string[] | string;
  responsibilities?: string[] | string;
  benefits?: string[] | string;
  skills?: string[] | string;
  location?: string;
  job_type?: string;
  employment_type?: string;
  work_mode?: string;
  salary_text?: string;
  salary_currency?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  apply_url?: string;
  is_active?: boolean;
  is_featured?: boolean;
  applied_count?: number;
  category_id?: string;
  company_id?: string;
  company?: Company;
  category?: Category;
  posted_date?: JobDate;
  deadline?: JobDate;
  created_at?: JobDate;
  updated_at?: JobDate;
}
