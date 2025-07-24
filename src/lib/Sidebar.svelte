<script lang="ts">
    import { onMount } from "svelte";

    let { selectedCategory = $bindable("all") } = $props();

    const categories = [
        { id: "all", name: "All Items", icon: "📦" },
        { id: "electronics", name: "Electronics", icon: "💻" },
        { id: "clothing", name: "Clothing", icon: "👕" },
        { id: "books", name: "Books", icon: "📚" },
        { id: "home", name: "Home & Garden", icon: "🏠" },
        { id: "sports", name: "Sports", icon: "⚽" },
        { id: "toys", name: "Toys & Games", icon: "🎮" },
        { id: "beauty", name: "Beauty", icon: "💄" },
        { id: "automotive", name: "Automotive", icon: "🚗" },
    ];

    const sortOptions = [
        { id: "newest", name: "Newest First" },
        { id: "oldest", name: "Oldest First" },
        { id: "price-low", name: "Price: Low to High" },
        { id: "price-high", name: "Price: High to Low" },
        { id: "popular", name: "Most Popular" },
    ];

    let selectedSort = $state("newest");

    // Keyboard navigation for sidebar
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            const currentIndex = categories.findIndex(
                (cat) => cat.id === selectedCategory,
            );
            let newIndex;

            if (event.key === "ArrowUp") {
                newIndex =
                    currentIndex > 0 ? currentIndex - 1 : categories.length - 1;
            } else {
                newIndex =
                    currentIndex < categories.length - 1 ? currentIndex + 1 : 0;
            }

            selectedCategory = categories[newIndex].id;
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    });
</script>

<div class="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
    <div class="p-4">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Categories</h2>

        <!-- Categories -->
        <div class="space-y-1 mb-6">
            {#each categories as category}
                <button
                    class="w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors duration-150 hover:bg-gray-100 {selectedCategory ===
                    category.id
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-700'}"
                    onclick={() => (selectedCategory = category.id)}
                >
                    <span class="mr-3 text-lg">{category.icon}</span>
                    <span class="text-sm font-medium">{category.name}</span>
                </button>
            {/each}
        </div>

        <!-- Sort Options -->
        <div class="border-t border-gray-200 pt-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-3">Sort By</h3>
            <select
                bind:value={selectedSort}
                class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                {#each sortOptions as option}
                    <option value={option.id}>{option.name}</option>
                {/each}
            </select>
        </div>

        <!-- Filters -->
        <div class="border-t border-gray-200 pt-4 mt-4">
            <h3 class="text-sm font-semibold text-gray-800 mb-3">Filters</h3>

            <!-- Price Range -->
            <div class="mb-4">
                <label class="block text-xs font-medium text-gray-700 mb-2"
                    >Price Range</label
                >
                <div class="flex items-center space-x-2">
                    <input
                        type="number"
                        placeholder="Min"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span class="text-gray-500">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            <!-- Rating Filter -->
            <div class="mb-4">
                <label class="block text-xs font-medium text-gray-700 mb-2"
                    >Minimum Rating</label
                >
                <div class="flex items-center space-x-1">
                    {#each [1, 2, 3, 4, 5] as star}
                        <button
                            class="text-yellow-400 hover:text-yellow-500 text-sm"
                            >⭐</button
                        >
                    {/each}
                </div>
            </div>

            <!-- Availability -->
            <div class="mb-4">
                <label class="flex items-center">
                    <input
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-xs text-gray-700">In Stock Only</span
                    >
                </label>
            </div>

            <!-- Free Shipping -->
            <div class="mb-4">
                <label class="flex items-center">
                    <input
                        type="checkbox"
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-xs text-gray-700">Free Shipping</span
                    >
                </label>
            </div>
        </div>

        <!-- Clear Filters -->
        <div class="border-t border-gray-200 pt-4 mt-4">
            <button
                class="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors duration-150"
            >
                Clear All Filters
            </button>
        </div>
    </div>
</div>
