import {
    collection,
    getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Company, Category, Job } from "@/types";
import { Timestamp } from "firebase/firestore";

const mapCompany = (id: string, data: Record<string, unknown>): Company => {
    return {
        id,
        name: typeof data.name === "string" ? data.name : "Unknown Company",
        logo_url: typeof data.logo_url === "string" ? data.logo_url : "",
        location: typeof data.location === "string" ? data.location : "",
        website: typeof data.website === "string" ? data.website : undefined,
    };
};

const mapCategory = (id: string, data: Record<string, unknown>): Category => {
    return {
        id,
        name: typeof data.name === "string" ? data.name : "General",
    };
};

export const getCompanies = async (): Promise<Company[]> => {
    const snapshot = await getDocs(collection(db, "companies"));

    const result = snapshot.docs.map((docSnap) =>
        mapCompany(docSnap.id, docSnap.data() as Record<string, unknown>)
    );

    // console.log("getCompanies():", result);

    return result;
};

export const getCategories = async (): Promise<Category[]> => {
    const snapshot = await getDocs(collection(db, "categories"));

    const result = snapshot.docs.map((docSnap) =>
        mapCategory(docSnap.id, docSnap.data() as Record<string, unknown>)
    );

    // console.log("getCategories():", result);

    return result;
};

export const getJobs = async (): Promise<Job[]> => {
    const snapshot = await getDocs(collection(db, "jobs"));

    const jobs = snapshot.docs.map((docSnap) => {
        const raw = docSnap.data() as any;

        const job: Job = {
            id: docSnap.id,
            title: raw.title ?? "Untitled Job",
            company: raw.company,
            category: raw.category,
            job_type: raw.job_type ?? "Full-Time",
            salary: raw.salary ?? "Negotiable",
            location: raw.location ?? "Sri Lanka",
            description: raw.description ?? "",
            requirements: raw.requirements ?? "",
            apply_url: raw.apply_url ?? "#",
            status: raw.status ?? "Active",
            is_featured: Boolean(raw.is_featured),
            posted_date:
                raw.posted_date instanceof Timestamp
                    ? raw.posted_date
                    : Timestamp.fromDate(new Date()),
            applied_count: Number(raw.applied_count) || 0,
        };

        return job;
    });

    // console.log("getJobs():", jobs);

    return jobs;
};
