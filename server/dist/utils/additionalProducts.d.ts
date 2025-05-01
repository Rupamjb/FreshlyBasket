declare const additionalProducts: {
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    unit: string;
    imageUrl: string;
}[];
declare const seedAdditionalProducts: () => Promise<never>;
export { additionalProducts, seedAdditionalProducts };
