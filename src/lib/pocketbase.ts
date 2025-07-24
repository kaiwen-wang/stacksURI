import PocketBase from 'pocketbase';

// Initialize PocketBase client
export const pb = new PocketBase('http://127.0.0.1:8090');

// Product type definition
export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    created: string;
    updated: string;
}

// Get all products
export async function getProducts(): Promise<Product[]> {
    try {
        const records = await pb.collection('products').getFullList<Product>();
        return records;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<Product[]> {
    try {
        if (category === 'all') {
            return await getProducts();
        }

        const records = await pb.collection('products').getFullList<Product>({
            filter: `category = "${category}"`
        });
        return records;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
}