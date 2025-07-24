<script lang="ts">
    import { onMount } from "svelte";

    let { selectedCategory, selectedSubcategory = $bindable("all") } = $props();

    // Define subcategories for each main category
    const subcategories: Record<string, { id: string; name: string }[]> = {
        all: [
            { id: "all", name: "All Items" },
            { id: "featured", name: "Featured" },
            { id: "new", name: "New Arrivals" },
            { id: "sale", name: "On Sale" },
        ],
        electronics: [
            { id: "all", name: "All Electronics" },
            { id: "computers", name: "Computers" },
            { id: "phones", name: "Phones" },
            { id: "tablets", name: "Tablets" },
            { id: "accessories", name: "Accessories" },
        ],
        clothing: [
            { id: "all", name: "All Clothing" },
            { id: "mens", name: "Men's" },
            { id: "womens", name: "Women's" },
            { id: "kids", name: "Kids" },
            { id: "shoes", name: "Shoes" },
        ],
        books: [
            { id: "all", name: "All Books" },
            { id: "fiction", name: "Fiction" },
            { id: "nonfiction", name: "Non-Fiction" },
            { id: "textbooks", name: "Textbooks" },
            { id: "ebooks", name: "E-Books" },
        ],
        home: [
            { id: "all", name: "All Home & Garden" },
            { id: "furniture", name: "Furniture" },
            { id: "decor", name: "Decor" },
            { id: "kitchen", name: "Kitchen" },
            { id: "garden", name: "Garden" },
        ],
        sports: [
            { id: "all", name: "All Sports" },
            { id: "fitness", name: "Fitness" },
            { id: "outdoor", name: "Outdoor" },
            { id: "team-sports", name: "Team Sports" },
            { id: "water-sports", name: "Water Sports" },
        ],
        toys: [
            { id: "all", name: "All Toys & Games" },
            { id: "action-figures", name: "Action Figures" },
            { id: "board-games", name: "Board Games" },
            { id: "video-games", name: "Video Games" },
            { id: "educational", name: "Educational" },
        ],
        beauty: [
            { id: "all", name: "All Beauty" },
            { id: "makeup", name: "Makeup" },
            { id: "skincare", name: "Skincare" },
            { id: "haircare", name: "Hair Care" },
            { id: "fragrance", name: "Fragrance" },
        ],
        automotive: [
            { id: "all", name: "All Automotive" },
            { id: "parts", name: "Parts" },
            { id: "accessories", name: "Accessories" },
            { id: "tools", name: "Tools" },
            { id: "maintenance", name: "Maintenance" },
        ],
    };

    // Get current subcategories based on selected main category
    const currentSubcategories = $derived(
        subcategories[selectedCategory] || subcategories.all,
    );

    // Reset subcategory when main category changes
    $effect(() => {
        if (selectedCategory) {
            selectedSubcategory = "all";
        }
    });

    // Keyboard navigation for top bar
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            const currentIndex = currentSubcategories.findIndex(
                (sub) => sub.id === selectedSubcategory,
            );
            let newIndex;

            if (event.key === "ArrowLeft") {
                newIndex =
                    currentIndex > 0
                        ? currentIndex - 1
                        : currentSubcategories.length - 1;
            } else {
                newIndex =
                    currentIndex < currentSubcategories.length - 1
                        ? currentIndex + 1
                        : 0;
            }

            selectedSubcategory = currentSubcategories[newIndex].id;
        }
    }

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    });
</script>

<div class="bg-white border-b border-gray-200 px-6 py-3">
    <div class="flex items-center space-x-1 overflow-x-auto">
        {#each currentSubcategories as subcategory}
            <button
                class="whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors duration-150 {selectedSubcategory ===
                subcategory.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'}"
                onclick={() => (selectedSubcategory = subcategory.id)}
            >
                {subcategory.name}
            </button>
        {/each}
    </div>
</div>
