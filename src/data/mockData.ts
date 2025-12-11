export interface Company {
  id: string;
  name: string;
  logo: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Job {
  id: string;
  title: string;
  company: Company;
  category: Category;
  location: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Hybrid';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  shortDescription: string;
  fullDescription: string;
  requirements: string[];
  applyUrl: string;
  appliedCount: number;
  isFeatured: boolean;
  postedAt: Date;
  createdAt: Date;
}

export const companies: Company[] = [
  { id: '1', name: 'TechCorp Lanka', logo: 'https://ui-avatars.com/api/?name=TechCorp&background=287194&color=fff&size=128' },
  { id: '2', name: 'Digital Solutions', logo: 'https://ui-avatars.com/api/?name=DS&background=1AA7C2&color=fff&size=128' },
  { id: '3', name: 'CloudNet Systems', logo: 'https://ui-avatars.com/api/?name=CNS&background=023246&color=fff&size=128' },
  { id: '4', name: 'FinTech Pro', logo: 'https://ui-avatars.com/api/?name=FTP&background=0D3B4C&color=fff&size=128' },
  { id: '5', name: 'Creative Agency', logo: 'https://ui-avatars.com/api/?name=CA&background=287194&color=fff&size=128' },
  { id: '6', name: 'DataDrive Analytics', logo: 'https://ui-avatars.com/api/?name=DDA&background=1AA7C2&color=fff&size=128' },
];

export const categories: Category[] = [
  { id: '1', name: 'Software Development', icon: 'code' },
  { id: '2', name: 'Design & Creative', icon: 'palette' },
  { id: '3', name: 'Marketing', icon: 'megaphone' },
  { id: '4', name: 'Data Science', icon: 'chart-bar' },
  { id: '5', name: 'Customer Support', icon: 'headphones' },
  { id: '6', name: 'Finance', icon: 'banknote' },
  { id: '7', name: 'Human Resources', icon: 'users' },
  { id: '8', name: 'Sales', icon: 'trending-up' },
];

export const jobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: companies[0],
    category: categories[0],
    location: 'Colombo',
    jobType: 'Full-time',
    salaryMin: 150000,
    salaryMax: 250000,
    currency: 'LKR',
    shortDescription: 'Join our team to build cutting-edge web applications using React and TypeScript.',
    fullDescription: 'We are looking for an experienced React Developer to join our growing team. You will be responsible for developing and implementing user interface components using React.js concepts and workflows such as Redux, Flux, and Webpack.',
    requirements: ['5+ years of React experience', 'TypeScript proficiency', 'Experience with Redux/MobX', 'Strong CSS skills', 'Git version control'],
    applyUrl: 'https://example.com/apply/1',
    appliedCount: 45,
    isFeatured: true,
    postedAt: new Date('2024-12-08'),
    createdAt: new Date('2024-12-08'),
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    company: companies[4],
    category: categories[1],
    location: 'Remote',
    jobType: 'Remote',
    salaryMin: 100000,
    salaryMax: 180000,
    currency: 'LKR',
    shortDescription: 'Create beautiful, intuitive designs for web and mobile applications.',
    fullDescription: 'We are seeking a talented UI/UX Designer to create amazing user experiences. You should have an eye for clean and artful design, possess superior UI skills and be able to translate high-level requirements into interaction flows and artifacts.',
    requirements: ['3+ years of UI/UX experience', 'Figma/Sketch proficiency', 'Portfolio required', 'Understanding of user-centered design', 'Prototyping skills'],
    applyUrl: 'https://example.com/apply/2',
    appliedCount: 32,
    isFeatured: true,
    postedAt: new Date('2024-12-09'),
    createdAt: new Date('2024-12-09'),
  },
  {
    id: '3',
    title: 'Digital Marketing Manager',
    company: companies[1],
    category: categories[2],
    location: 'Kandy',
    jobType: 'Hybrid',
    salaryMin: 120000,
    salaryMax: 200000,
    currency: 'LKR',
    shortDescription: 'Lead our digital marketing initiatives and grow our online presence.',
    fullDescription: 'We are looking for an experienced Digital Marketing Manager to develop, implement, track and optimize our digital marketing campaigns across all digital channels.',
    requirements: ['4+ years in digital marketing', 'SEO/SEM expertise', 'Analytics tools knowledge', 'Content marketing experience', 'Social media management'],
    applyUrl: 'https://example.com/apply/3',
    appliedCount: 28,
    isFeatured: false,
    postedAt: new Date('2024-12-07'),
    createdAt: new Date('2024-12-07'),
  },
  {
    id: '4',
    title: 'Data Analyst',
    company: companies[5],
    category: categories[3],
    location: 'Colombo',
    jobType: 'Full-time',
    salaryMin: 130000,
    salaryMax: 220000,
    currency: 'LKR',
    shortDescription: 'Analyze complex data sets to drive business decisions.',
    fullDescription: 'We are looking for a Data Analyst to join our team. You will be responsible for analyzing large data sets to identify trends, developing reports, and presenting findings to stakeholders.',
    requirements: ['2+ years of data analysis', 'SQL proficiency', 'Python/R knowledge', 'Data visualization tools', 'Statistical analysis skills'],
    applyUrl: 'https://example.com/apply/4',
    appliedCount: 19,
    isFeatured: false,
    postedAt: new Date('2024-12-10'),
    createdAt: new Date('2024-12-10'),
  },
  {
    id: '5',
    title: 'Customer Support Lead',
    company: companies[2],
    category: categories[4],
    location: 'Galle',
    jobType: 'Full-time',
    salaryMin: 80000,
    salaryMax: 130000,
    currency: 'LKR',
    shortDescription: 'Lead our customer support team to deliver exceptional service.',
    fullDescription: 'We are seeking a Customer Support Lead to manage our support team and ensure customer satisfaction. You will be responsible for training staff, handling escalations, and improving support processes.',
    requirements: ['3+ years in customer support', 'Team leadership experience', 'Excellent communication', 'Problem-solving skills', 'CRM experience'],
    applyUrl: 'https://example.com/apply/5',
    appliedCount: 15,
    isFeatured: false,
    postedAt: new Date('2024-12-06'),
    createdAt: new Date('2024-12-06'),
  },
  {
    id: '6',
    title: 'Full Stack Developer',
    company: companies[3],
    category: categories[0],
    location: 'Colombo',
    jobType: 'Hybrid',
    salaryMin: 180000,
    salaryMax: 300000,
    currency: 'LKR',
    shortDescription: 'Build end-to-end solutions for our fintech platform.',
    fullDescription: 'Join our fintech team to develop full-stack solutions. You will work on both frontend and backend systems, ensuring seamless integration and optimal performance.',
    requirements: ['4+ years full-stack experience', 'React & Node.js', 'Database design', 'API development', 'Security best practices'],
    applyUrl: 'https://example.com/apply/6',
    appliedCount: 52,
    isFeatured: true,
    postedAt: new Date('2024-12-11'),
    createdAt: new Date('2024-12-11'),
  },
  {
    id: '7',
    title: 'HR Coordinator',
    company: companies[0],
    category: categories[6],
    location: 'Colombo',
    jobType: 'Full-time',
    salaryMin: 70000,
    salaryMax: 110000,
    currency: 'LKR',
    shortDescription: 'Support our HR team with recruitment and employee relations.',
    fullDescription: 'We are looking for an HR Coordinator to assist with day-to-day HR operations including recruitment, onboarding, and employee engagement activities.',
    requirements: ['2+ years HR experience', 'HRIS knowledge', 'Recruitment experience', 'Excellent interpersonal skills', 'Confidentiality'],
    applyUrl: 'https://example.com/apply/7',
    appliedCount: 24,
    isFeatured: false,
    postedAt: new Date('2024-12-05'),
    createdAt: new Date('2024-12-05'),
  },
  {
    id: '8',
    title: 'Sales Executive',
    company: companies[1],
    category: categories[7],
    location: 'Negombo',
    jobType: 'Full-time',
    salaryMin: 60000,
    salaryMax: 150000,
    currency: 'LKR',
    shortDescription: 'Drive sales growth and build strong client relationships.',
    fullDescription: 'We are seeking an ambitious Sales Executive to join our team. You will be responsible for generating leads, closing deals, and maintaining client relationships.',
    requirements: ['1+ years in sales', 'Strong communication', 'Negotiation skills', 'Target-oriented', 'Valid driving license'],
    applyUrl: 'https://example.com/apply/8',
    appliedCount: 38,
    isFeatured: false,
    postedAt: new Date('2024-12-04'),
    createdAt: new Date('2024-12-04'),
  },
];

// Page views counter (mock - in real app this would be in Firestore)
export let pageViews = 12547;

export const incrementPageViews = () => {
  pageViews += 1;
  return pageViews;
};

export const getPageViews = () => pageViews;
