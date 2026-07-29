export interface Stats {
    yearsOfExcellence: number; yearsLabel: string;
    skilledProfessionals: number; professionalsLabel: string;
    successfulProjects: number; projectsLabel: string;
    happyClients: number; clientsLabel: string;
}

export interface WhoWeServeItem { title: string; description: string; image: string; icon: string; link?: string; }
export interface WhatIsIncludedItem { title: string; description: string; icon: string; }
export interface Cta { title: string; subtitle: string; buttonText: string; whatsappText: string; image: string; }
export interface AboutSection {
    title: string; description: string; image: string;
    foundedYear: string; outlets: number; teamSize: number; factoryInfo: string;
}
export interface ProcessStep { step: string; title: string; description: string; icon: string; }
export interface ProcessSection { title: string; description: string; steps: ProcessStep[]; }
export interface MaterialItem { name: string; description: string; image: string; icon: string; }
export interface MaterialsSection { title: string; description: string; items: MaterialItem[]; }
export interface WhyChooseUsItem { title: string; description: string; icon: string; image: string; }
export interface WhyChooseUsSection { title: string; items: WhyChooseUsItem[]; }
export interface Faq { question: string; answer: string; }
export interface ContactSection { title: string; description: string; }
export interface Seo { metaTitle: string; metaDescription: string; keywords: string[]; }

/** Shape returned by GET /services or GET /services/:id */
export interface GetService {
    _id: string; title: string; slug: string;
    shortDescription: string; fullDescription: string;
    image: string; icon: string;
    heroTitle: string; heroSubtitle: string; heroImage: string;
    stats: Stats;
    whoWeServe: WhoWeServeItem[];
    whoWeServeTitle: string; whoWeServeDescription: string;
    whatIsIncluded: WhatIsIncludedItem[];
    whatIsIncludedTitle: string; whatIsIncludedDescription: string;
    cta: Cta; about: AboutSection; process: ProcessSection;
    materials: MaterialsSection; whyChooseUs: WhyChooseUsSection;
    faqs: Faq[]; contact: ContactSection; seo: Seo;
    order: number; isActive: boolean; isFeatured: boolean;
    parentService: string | null; createdAt: string; updatedAt: string;
}

/** Shape sent to PATCH /services/:id */
export interface ServiceForm {
    title: string; slug: string; shortDescription: string; fullDescription: string;
    image: string; icon: string;
    heroTitle: string; heroSubtitle: string; heroImage: string;
    stats: Stats;
    whoWeServe: { title: string; description: string; items: WhoWeServeItem[] };
    whatIsIncluded: { title: string; description: string; items: WhatIsIncludedItem[] };
    cta: Cta; about: AboutSection; process: ProcessSection;
    materials: MaterialsSection; whyChooseUs: WhyChooseUsSection;
    faqs: Faq[]; contact: ContactSection; seo: Seo;
    order: number; isActive: boolean; isFeatured: boolean;
}

/** Minimal shape used in the list view */
export interface ServiceListItem {
    _id: string; title: string; slug: string; shortDescription: string;
    image: string; icon: string; order: number; isActive: boolean; isFeatured: boolean;
}
