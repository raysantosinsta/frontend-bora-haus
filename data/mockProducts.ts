// data/mockProducts.ts
export interface Product {
    id: string;
    slug: string;
    category: string;
    subcategory: string;
    brand: string;
    name: string;
    headline: string;
    description: string;
    image: string;
    /** Optional: used for grouping in the list view */
    categorySlug?: string;
}

export const mockProducts: Product[] = [
    {
        id: "k-beauty-loreal-paris-elseve-oleo",
        slug: "k-beauty-loreal-paris-elseve-oleo",
        category: "K-Beauty",
        categorySlug: "k-beauty",
        subcategory: "Cabelo",
        brand: "L'Oréal Paris",
        name: "Óleo Extraordinário Elseve",
        headline: "óleos preciosos.",
        description: "Brilho que dura o dia inteiro.",
        image: "/oleo1.png",
    },
    
];