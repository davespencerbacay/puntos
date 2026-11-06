export interface FAQCategory {
    id: string;
    label: string;
    icon: string;
}

export interface FAQItem {
    id: string;
    category: string;
    question: string;
    answer: string;
    keywords?: string[];
    popular?: boolean;
}