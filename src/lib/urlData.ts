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
    // Electronics
    {
        id: "1",
        name: "MacBook Pro M3",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
    },
    {
        id: "2",
        name: "iPad Pro",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop"
    },
    {
        id: "3",
        name: "iPhone 15 Pro",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop"
    },
    {
        id: "4",
        name: "Apple Watch Ultra",
        category: "electronics",
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop"
    },

    // Software
    {
        id: "5",
        name: "VS Code",
        category: "software",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop"
    },
    {
        id: "6",
        name: "Figma",
        category: "software",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop"
    },
    {
        id: "7",
        name: "Obsidian",
        category: "software",
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop"
    },
    {
        id: "8",
        name: "Alacritty Terminal",
        category: "software",
        image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400&h=400&fit=crop"
    },

    // Clothing
    {
        id: "9",
        name: "AER Duffel Bag",
        category: "clothing",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
    },
    {
        id: "10",
        name: "Minimalist Backpack",
        category: "clothing",
        image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=400&h=400&fit=crop"
    },
    {
        id: "11",
        name: "Quality T-Shirt",
        category: "clothing",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"
    },
    {
        id: "12",
        name: "Denim Jacket",
        category: "clothing",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop"
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