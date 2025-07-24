<script lang="ts">
    import { onMount } from "svelte";

    let { selectedCategory = $bindable("all") } = $props();

    const categories = [
        { id: "all", name: "All Items" },
        { id: "electronics", name: "Electronics" },
        { id: "clothing", name: "Clothing" },
        { id: "books", name: "Books" },
        { id: "home", name: "Home & Garden" },
        { id: "sports", name: "Sports" },
        { id: "toys", name: "Toys & Games" },
        { id: "beauty", name: "Beauty" },
        { id: "automotive", name: "Automotive" },
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

<div class="w-64 bg-white border-r border-gray-100 h-screen overflow-y-auto">
    <div class="px-6 py-5">
        <h2
            class="text-xs font-light tracking-[0.2em] text-gray-500 mb-8 uppercase"
        >
            Categories
        </h2>

        <!-- Categories -->
        <div class="space-y-0 mb-8">
            {#each categories as category}
                <button
                    class="w-full group relative text-left py-3 px-0 transition-all duration-200 hover:text-gray-900 {selectedCategory ===
                    category.id
                        ? 'text-gray-900'
                        : 'text-gray-600'}"
                    onclick={() => (selectedCategory = category.id)}
                >
                    <!-- Selection marker -->
                    <div
                        class="absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-300 {selectedCategory ===
                        category.id
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-2'}"
                    >
                        <svg
                            class="w-3 h-3 text-gray-900"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>

                    <!-- Category name with underline -->
                    <span
                        class="text-sm font-light tracking-wide pl-6 relative"
                    >
                        {category.name}
                        <span
                            class="absolute bottom-0 left-6 right-0 h-px bg-gray-900 transition-all duration-300 {selectedCategory ===
                            category.id
                                ? 'opacity-100 scale-x-100'
                                : 'opacity-0 scale-x-0'} origin-left"
                        ></span>
                    </span>
                </button>
            {/each}
        </div>

        <!-- Sort Options -->
        <div class="border-t border-gray-100 pt-6 mt-2">
            <h3
                class="text-xs font-light tracking-[0.2em] text-gray-500 mb-4 uppercase"
            >
                Sort By
            </h3>
            <select
                bind:value={selectedSort}
                class="w-full px-0 py-2 text-sm font-light border-0 border-b border-gray-200 bg-transparent focus:outline-none focus:border-gray-400 transition-colors duration-200"
            >
                {#each sortOptions as option}
                    <option value={option.id}>{option.name}</option>
                {/each}
            </select>
        </div>

        <!-- Filters -->
        <div class="border-t border-gray-100 pt-6 mt-6">
            <h3
                class="text-xs font-light tracking-[0.2em] text-gray-500 mb-4 uppercase"
            >
                Filters
            </h3>

            <!-- Price Range -->
            <div class="mb-6">
                <label
                    class="block text-xs font-light text-gray-600 mb-3 tracking-wide"
                    >Price Range</label
                >
                <div class="flex items-center space-x-3">
                    <input
                        type="number"
                        placeholder="Min"
                        class="w-full px-0 py-2 text-xs font-normal border-0 border-b border-gray-200 bg-transparent focus:outline-none focus:border-gray-400 transition-colors duration-200"
                    />
                    <span class="text-gray-400 text-xs">—</span>
                    <input
                        type="number"
                        placeholder="Max"
                        class="w-full px-0 py-2 text-xs font-light border-0 border-b border-gray-200 bg-transparent focus:outline-none focus:border-gray-400 transition-colors duration-200"
                    />
                </div>
            </div>

            <!-- Rating Filter -->
            <div class="mb-6">
                <label
                    class="block text-xs font-light text-gray-600 mb-3 tracking-wide"
                    >Minimum Rating</label
                >
                <div class="flex items-center space-x-1">
                    {#each [1, 2, 3, 4, 5] as star}
                        <button
                            class="text-gray-300 hover:text-gray-600 text-xs transition-colors duration-200"
                            >★</button
                        >
                    {/each}
                </div>
            </div>

            <!-- Availability -->
            <div class="mb-4">
                <label class="flex items-center group cursor-pointer">
                    <input type="checkbox" class="sr-only" />
                    <div
                        class="w-3 h-3 border border-gray-300 group-hover:border-gray-400 transition-colors duration-200 mr-3"
                    ></div>
                    <span class="text-xs font-light text-gray-600 tracking-wide"
                        >In Stock Only</span
                    >
                </label>
            </div>

            <!-- Free Shipping -->
            <div class="mb-6">
                <label class="flex items-center group cursor-pointer">
                    <input type="checkbox" class="sr-only" />
                    <div
                        class="w-3 h-3 border border-gray-300 group-hover:border-gray-400 transition-colors duration-200 mr-3"
                    ></div>
                    <span class="text-xs font-light text-gray-600 tracking-wide"
                        >Free Shipping</span
                    >
                </label>
            </div>
        </div>

        <!-- Clear Filters -->
        <div class="border-t border-gray-100 pt-6 mt-2">
            <button
                class="w-full py-2 text-xs font-light text-gray-500 hover:text-gray-700 tracking-wide transition-colors duration-200 uppercase"
            >
                Clear All Filters
            </button>
        </div>
    </div>
</div>
