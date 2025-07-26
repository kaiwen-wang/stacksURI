// URL-based data storage system
// Instead of using a database, we encode product data directly in the URL

export interface Product {
    id: string;
    name: string;
    category: string;
    image: string; // URL to external image
    created?: string;
    updated?: string;
}

// Default sample products with external image URLs
export const defaultProducts: Product[] = [
    {
        id: "1",
        name: "MacBook Pro 13'' (2020)",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop"
    }
];

// Encode products array to URL-safe string
export function encodeProductsToUrl(products: Product[]): string {
    try {
        const jsonString = JSON.stringify(products);
        return btoa(encodeURIComponent(jsonString));
    } catch (error) {
        console.error('Error encoding products:', error);
        return '';
    }
}

// Decode products from URL parameter
export function decodeProductsFromUrl(encodedData: string): Product[] {
    try {
        if (!encodedData) {
            return defaultProducts;
        }
        const jsonString = decodeURIComponent(atob(encodedData));
        const products = JSON.parse(jsonString);
        return Array.isArray(products) ? products : defaultProducts;
    } catch (error) {
        console.error('Error decoding products:', error);
        return defaultProducts;
    }
}

// Get products by category from URL data
export function getProductsByCategory(products: Product[], category: string): Product[] {
    if (category === 'all') {
        return products;
    }
    return products.filter(product => product.category === category);
}

// Add a new product to the existing products array
export function addProduct(products: Product[], newProduct: Omit<Product, 'id' | 'created' | 'updated'>): Product[] {
    const product: Product = {
        ...newProduct,
        id: Date.now().toString(),
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };
    return [...products, product];
}

// Update URL with new products data
export function updateUrlWithProducts(products: Product[]): void {
    const encodedData = encodeProductsToUrl(products);
    const url = new URL(window.location.href);

    if (encodedData) {
        url.searchParams.set('data', encodedData);
    } else {
        url.searchParams.delete('data');
    }

    // Update URL without page reload
    window.history.replaceState({}, '', url.toString());
}

// Get shareable URL for current products
export function getShareableUrl(products: Product[]): string {
    const encodedData = encodeProductsToUrl(products);
    const url = new URL(window.location.origin + window.location.pathname);

    if (encodedData) {
        url.searchParams.set('data', encodedData);
    }

    return url.toString();
}

// Create a URL for a specific product set
export function createProductUrl(products: Product[]): string {
    return getShareableUrl(products);
}

// Validate image URL (basic check)
export function isValidImageUrl(url: string): boolean {
    try {
        new URL(url);
        return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) ||
            url.includes('unsplash.com') ||
            url.includes('images.') ||
            url.includes('cdn.');
    } catch {
        return false;
    }
}