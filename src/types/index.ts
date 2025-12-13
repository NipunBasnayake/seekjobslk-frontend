import {Timestamp} from 'firebase/firestore';

export interface Job {
    id: string;
    title: string;
    company: Company;
    category: Category;
    job_type: 'Full-Time' | 'Part-Time' | 'Remote' | 'Hybrid';
    salary: string;
    location: string;
    description: string;
    requirements: string | string[];
    apply_url: string;
    status: 'Active' | 'Inactive';
    is_featured: boolean;
    posted_date: Timestamp;
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