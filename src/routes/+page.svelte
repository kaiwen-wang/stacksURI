<script lang="ts">
    import Modal from "$lib/Modal.svelte";
    import { getProductsByCategory, type Product } from "$lib/pocketbase";
    import { getContext } from "svelte";

    // Modal state
    let isModalOpen = $state(false);
    let selectedProduct: Product | null = $state(null);

    function openModal(product: Product) {
        console.log("Opening modal for product:", product);
        selectedProduct = product;
        isModalOpen = true;
        document.body.classList.add("modal-open");
    }

    function closeModal() {
        isModalOpen = false;
        selectedProduct = null;
        document.body.classList.remove("modal-open");
    }

    // Get selected category from context
    const categoryContext = getContext("selectedCategory") as
        | { value: string }
        | undefined;
    const subcategoryContext = getContext("selectedSubcategory") as
        | { value: string }
        | undefined;
    const selectedCategory = $derived(categoryContext?.value || "all");
    const selectedSubcategory = $derived(subcategoryContext?.value || "all");

    // Fetch products from PocketBase based on selected category
    let products = $state<Product[]>([]);
    let loading = $state(true);
    let error = $state<string | null>(null);

    // Load products when category changes
    $effect(() => {
        const loadProducts = async () => {
            loading = true;
            error = null;
            try {
                products = await getProductsByCategory(selectedCategory);
            } catch (err) {
                error =
                    err instanceof Error
                        ? err.message
                        : "Failed to load products";
                console.error("Error loading products:", err);
            } finally {
                loading = false;
            }
        };

        loadProducts();
    });

    // Filtered products (for future subcategory filtering if needed)
    const filteredProducts = $derived(products);

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
    {#if loading}
        <div class="flex justify-center items-center h-64">
            <div class="text-lg text-gray-600">Loading products...</div>
        </div>
    {:else if error}
        <div class="flex justify-center items-center h-64">
            <div class="text-lg text-red-600">Error: {error}</div>
        </div>
    {:else}
        <div
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0"
        >
            <!-- Product cards from PocketBase -->
            {#each filteredProducts as product}
                <div
                    class="aspect-square border border-gray-300 relative hover:border-blue-500 transition-colors duration-200 hover:shadow-lg cursor-pointer"
                    onclick={() => openModal(product)}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === "Enter" && openModal(product)}
                >
                    <div
                        class="w-full h-full bg-gray-200 flex items-center justify-center"
                    >
                        <span class="text-6xl">{product.image}</span>
                    </div>
                    <div class="absolute bottom-0 left-0 p-3">
                        <h3
                            class="font-semibold text-sm bg-white bg-opacity-90 px-2 py-1 rounded"
                        >
                            {product.name}
                        </h3>
                        <p
                            class="text-xs text-gray-600 bg-white bg-opacity-90 px-2 py-1 rounded mt-1"
                        >
                            ${product.price}
                        </p>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>

<!-- Modal component -->
<Modal isOpen={isModalOpen} onClose={closeModal} />
