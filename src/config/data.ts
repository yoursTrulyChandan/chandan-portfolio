// ============================================================
// PORTFOLIO DATA — update this file to change all site content
// ============================================================

export const personal = {
  name: 'Chandan Nayak',
  role: 'Frontend Developer',
  tagline: 'Crafting beautiful, high-performance web experiences',
  email: 'chandan.nayak0297@gmail.com',
  phone: '+91 9574408872',
  location: 'Surat, Gujarat, India',
  linkedin: 'https://www.linkedin.com/in/chandan-nayak-frontend-developer/',
  github: 'https://github.com/yoursTrulyChandan',
  // Add more socials here as needed
  bio: `Frontend Developer with 4+ years of experience building polished, performant web applications.
  I specialize in React and Next.js ecosystems, with a passion for turning complex ideas into clean,
  intuitive interfaces. From financial automation platforms to real-time communication tools — I build
  products people love to use.`,
  roles: [
    'Frontend Developer',
    'React Specialist',
    'UI/UX Enthusiast',
    'Next.js Developer',
    'Product Builder',
  ],
  stats: [
    { label: 'Years Experience', value: 4, suffix: '+' },
    { label: 'Projects Built', value: 11, suffix: '' },
    { label: 'Companies', value: 4, suffix: '' },
    { label: 'Languages Spoken', value: 6, suffix: '+' },
  ],
};

export const skills = [
  {
    category: 'Frontend Core',
    color: '#00d4ff',
    items: [
      { name: 'React JS', level: 95 },
      { name: 'Next JS', level: 92 },
      { name: 'TypeScript', level: 88 },
      { name: 'JavaScript', level: 95 },
      { name: 'HTML5', level: 97 },
      { name: 'CSS3', level: 93 },
    ],
  },
  {
    category: 'Styling & UI',
    color: '#7c3aed',
    items: [
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Material UI', level: 85 },
      { name: 'Bootstrap', level: 88 },
      { name: 'Headless UI', level: 80 },
      { name: 'Next UI', level: 78 },
      { name: 'Framer Motion', level: 75 },
    ],
  },
  {
    category: 'Data & Backend',
    color: '#f97316',
    items: [
      { name: 'GraphQL', level: 80 },
      { name: 'Supabase', level: 75 },
      { name: 'PostgreSQL', level: 70 },
      { name: 'SQL', level: 72 },
      { name: 'Python', level: 60 },
      { name: 'Directus', level: 78 },
    ],
  },
  {
    category: 'Tools & Platforms',
    color: '#10b981',
    items: [
      { name: 'GitHub', level: 90 },
      { name: 'Socket.io', level: 80 },
      { name: 'React Native', level: 75 },
      { name: 'Squidex CMS', level: 78 },
      { name: 'Remix', level: 72 },
      { name: 'Lenis', level: 70 },
    ],
  },
];

export const experience = [
  {
    company: 'Molecule Ventures',
    role: 'Software Engineer (Frontend Lead)',
    period: 'Jun 2024 – Present',
    location: 'Surat, Gujarat, India',
    color: '#00d4ff',
    description:
      'Architected and built automation tools to transform and structure complex financial data, with a core focus on product design and development.',
    highlights: [
      'Led frontend architecture for a multi-layered stock analytics platform',
      'Designed Threads-style interactive feed for real-time team collaboration',
      'Built bulk email automation & employee activity tracking dashboard',
      'Integrated AI models for data structuring and performance optimization',
    ],
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'React', 'Python'],
  },
  {
    company: 'Propelius Technologies',
    role: 'Frontend Developer',
    period: 'Sep 2023 – Apr 2024',
    location: 'Surat, Gujarat, India',
    color: '#7c3aed',
    description:
      'Created diverse web applications from foreign exchange platforms to vendor-specific apps, while maintaining complex enterprise websites.',
    highlights: [
      'Built foreign exchange website with live rates & role-based access',
      'Developed currency exchange app with location-based services',
      'Integrated GraphQL with Squidex CMS for content management',
      'Implemented real-time chat with Socket.io and Directus backend',
    ],
    tech: ['Next.js', 'TypeScript', 'Material UI', 'GraphQL', 'Socket.io'],
  },
  {
    company: 'Extreme Thoughts Softtech',
    role: 'Frontend Developer',
    period: 'Dec 2022 – Aug 2023',
    location: 'Surat, Gujarat, India',
    color: '#f97316',
    description:
      'Created an E-commerce platform and worked under the DevOps lead for fulfilling BI tasks using SSIS and MySQL.',
    highlights: [
      'Built full-featured e-commerce platform with admin & user portals',
      'Fulfilled BI reporting tasks using SSIS pipelines and MySQL',
      'Designed product catalog system with advanced filtering',
      'Collaborated with DevOps on CI/CD pipeline improvements',
    ],
    tech: ['React.js', 'JavaScript', 'MySQL', 'SSIS', 'CSS3'],
  },
  {
    company: 'Sochcast Media Pvt. Ltd.',
    role: 'Frontend Developer',
    period: 'Sep 2021 – Sep 2022',
    location: 'Bangalore, Karnataka, India',
    color: '#10b981',
    description:
      'Worked in a product-based company to build a podcast platform with creator and listener dashboards.',
    highlights: [
      'Developed creator dashboard for podcast upload & management',
      'Built listener platform with categorized podcast browsing',
      'Implemented investor dashboard with interactive drill-down charts',
      'Owned end-to-end UI/UX design for all major user flows',
    ],
    tech: ['React.js', 'Bootstrap', 'JavaScript', 'REST APIs', 'Chart.js'],
  },
];

export const projects = [
  {
    title: 'Financial Automation',
    description:
      'Multi-layered stock analytics system with Threads-style interactive feed for team collaboration and real-time data insights.',
    tech: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Python'],
    color: '#00d4ff',
    // Add live: 'https://...' and repo: 'https://...' when available
    live: null,
    repo: null,
    featured: true,
    category: 'Full Stack',
  },
  {
    title: 'Client Dashboard',
    description:
      'Bulk email automation, employee activity logging, and real-time status tracking with AI-powered data structuring.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    color: '#7c3aed',
    live: null,
    repo: null,
    featured: true,
    category: 'Dashboard',
  },
  {
    title: 'Sterling Fitness',
    description:
      'Fitness management platform (admin) with customer tracking, credit usage monitoring, and integrated analytics.',
    tech: ['React Native', 'TypeScript', 'Analytics'],
    color: '#f97316',
    live: null,
    repo: null,
    featured: true,
    category: 'Mobile',
  },
  {
    title: 'Foreign Exchange Finance App',
    description:
      'Role-based forex website with live country rates, auto-response system and live chat with real-time updates.',
    tech: ['Next.js', 'TypeScript', 'Material UI', 'Socket.io', 'Directus'],
    color: '#10b981',
    live: null,
    repo: null,
    featured: false,
    category: 'Web App',
  },
  {
    title: 'Currency Exchange App',
    description:
      'Location-based currency exchange platform with integrated GraphQL and Squidex CMS for dynamic content.',
    tech: ['Next.js', 'TypeScript', 'GraphQL', 'Squidex CMS'],
    color: '#f59e0b',
    live: null,
    repo: null,
    featured: false,
    category: 'Web App',
  },
  {
    title: 'Investor Dashboard',
    description:
      'Metrics dashboard (signups, users, creators) with interactive drill-down charts and custom date-picker. Full UI/UX ownership.',
    tech: ['React.js', 'Bootstrap', 'Chart.js', 'JavaScript'],
    color: '#ec4899',
    live: null,
    repo: null,
    featured: false,
    category: 'Dashboard',
  },
  {
    title: 'Tailor App',
    description:
      'Two-sided platform connecting tailors and clients for managing service requests and acceptance workflows.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    color: '#6366f1',
    live: null,
    repo: null,
    featured: false,
    category: 'Web App',
  },
  {
    title: 'Sochcast Platform',
    description:
      'Creator and listener sides of a podcast platform with categorized browsing and podcast upload/management.',
    tech: ['React.js', 'Bootstrap', 'JavaScript', 'REST API'],
    color: '#14b8a6',
    live: null,
    repo: null,
    featured: false,
    category: 'Product',
  },
  {
    title: 'QR Code Generator',
    description:
      'Versatile QR code app with download, aesthetic customization, and dynamic data encoding capabilities.',
    tech: ['React.js', 'JavaScript', 'CSS3'],
    color: '#8b5cf6',
    live: null,
    repo: null,
    featured: false,
    category: 'Tool',
  },
];

export const languages = [
  { name: 'English', level: 'Fluent' },
  { name: 'Hindi', level: 'Fluent' },
  { name: 'Odia', level: 'Native' },
  { name: 'Gujarati', level: 'Proficient' },
  { name: 'Bengali', level: 'Conversational' },
  { name: 'Marathi', level: 'Conversational' },
  { name: 'Japanese', level: 'Learning' },
];
