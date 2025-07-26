// URL-based data storage system
// Instead of using a database, we encode product data directly in the URL

import { defaultProducts } from './defaultProducts';

export interface Product {
    id: string;
    name: string;
    category: string;
    image: string; // URL to external image
    created?: string;
    updated?: string;
}

export { defaultProducts };

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

// Delete a product from the existing products array
export function deleteProduct(products: Product[], productId: string): Product[] {
    return products.filter(product => product.id !== productId);
}

// Update an existing product in the products array
export function updateProduct(products: Product[], productId: string, updatedData: Partial<Omit<Product, 'id' | 'created'>>): Product[] {
    return products.map(product =>
        product.id === productId
            ? { ...product, ...updatedData, updated: new Date().toISOString() }
            : product
    );
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