<script lang="ts">
    // Sample product data with categories
    const products = [
        {
            id: 1,
            name: "Laptop Pro",
            category: "electronics",
            price: 1299,
            image: "💻",
            rating: 4.5,
        },
        {
            id: 2,
            name: "Cotton T-Shirt",
            category: "clothing",
            price: 29,
            image: "👕",
            rating: 4.2,
        },
        {
            id: 3,
            name: "JavaScript Guide",
            category: "books",
            price: 39,
            image: "📚",
            rating: 4.8,
        },
        {
            id: 4,
            name: "Garden Tools Set",
            category: "home",
            price: 89,
            image: "🏠",
            rating: 4.3,
        },
        {
            id: 5,
            name: "Soccer Ball",
            category: "sports",
            price: 25,
            image: "⚽",
            rating: 4.1,
        },
        {
            id: 6,
            name: "Gaming Console",
            category: "toys",
            price: 499,
            image: "🎮",
            rating: 4.7,
        },
        {
            id: 7,
            name: "Lipstick Set",
            category: "beauty",
            price: 45,
            image: "💄",
            rating: 4.4,
        },
        {
            id: 8,
            name: "Car Accessories",
            category: "automotive",
            price: 129,
            image: "🚗",
            rating: 4.0,
        },
        {
            id: 9,
            name: "Smartphone",
            category: "electronics",
            price: 799,
            image: "📱",
            rating: 4.6,
        },
        {
            id: 10,
            name: "Jeans",
            category: "clothing",
            price: 79,
            image: "👖",
            rating: 4.3,
        },
        {
            id: 11,
            name: "Cookbook",
            category: "books",
            price: 24,
            image: "📖",
            rating: 4.5,
        },
        {
            id: 12,
            name: "Plant Pot",
            category: "home",
            price: 19,
            image: "🪴",
            rating: 4.2,
        },
    ];

    // Get selected category from context
    import { getContext } from "svelte";
    const categoryContext = getContext("selectedCategory") as
        | { value: string }
        | undefined;
    const subcategoryContext = getContext("selectedSubcategory") as
        | { value: string }
        | undefined;
    const selectedCategory = $derived(categoryContext?.value || "all");
    const selectedSubcategory = $derived(subcategoryContext?.value || "all");

    // Filter products based on selected category
    const filteredProducts = $derived(
        selectedCategory === "all"
            ? products
            : products.filter(
                  (product) => product.category === selectedCategory,
              ),
    );

    // Get category display name
    const categoryNames: Record<string, string> = {
        all: "All Items",
        electronics: "Electronics",
        clothing: "Clothing",
        books: "Books",
        home: "Home & Garden",
        sports: "Sports",
        toys: "Toys & Games",
        beauty: "Beauty",
        automotive: "Automotive",
    };
</script>

<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-8">Product Grid</h1>

    <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0"
    >
        <!-- Sample product cards -->
        {#each filteredProducts as product, i}
            <div
                class="aspect-square border border-gray-300 relative hover:border-blue-500 transition-colors duration-200 hover:shadow-lg"
            >
                <div
                    class="w-full h-full bg-gray-200 flex items-center justify-center"
                >
                    <span class="text-gray-500 text-sm">Product Image</span>
                </div>
                <div class="absolute bottom-0 left-0 p-3">
                    <h3
                        class="font-semibold text-sm bg-white bg-opacity-90 px-2 py-1 rounded"
                    >
                        {product.name}
                    </h3>
                </div>
            </div>
        {/each}
    </div>
</div>
