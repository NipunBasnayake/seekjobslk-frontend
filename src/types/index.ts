import { Timestamp } from 'firebase/firestore';

export type JobDate =
    | Timestamp
    | Date
    | string
    | { seconds?: number; nanoseconds?: number }
    | null;

export interface Job {
    id: string;
    title: string;
    company: Company;
    category: Category;

    companyId?: string;
    categoryId?: string;

    job_type: 'Full-Time' | 'Part-Time' | 'Remote' | 'Hybrid';
    salary: string;
    location: string;
    description: string;
    requirements: string | string[];
    apply_url: string;
    status: 'Active' | 'Inactive';
    is_featured: boolean;
    posted_date: JobDate;
    applied_count: number;
}

export interface Company {
    id: string;
    name: string;
    location: string;
    logo_url: string;
    website?: string;
}

export interface Category {
    id: string;
    name: string;
}
