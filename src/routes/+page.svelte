<script lang="ts">
    import Modal from "$lib/Modal.svelte";
    import AddProductModal from "$lib/AddProductModal.svelte";
    import {
        getProductsByCategory,
        addProduct,
        updateUrlWithProducts,
        getShareableUrl,
        isValidImageUrl,
        type Product,
    } from "$lib/urlData";
    import { getContext } from "svelte";

    // Modal state
    let isModalOpen = $state(false);
    let selectedProduct: Product | null = $state(null);

    // Add product modal state
    let isAddModalOpen = $state(false);

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

    function openAddModal() {
        isAddModalOpen = true;
        document.body.classList.add("modal-open");
    }

    function closeAddModal() {
        isAddModalOpen = false;
    }

    // Get contexts from layout
    const categoryContext = getContext("selectedCategory") as
        | { value: string }
        | undefined;
    const subcategoryContext = getContext("selectedSubcategory") as
        | { value: string }
        | undefined;
    const allProductsContext = getContext("allProducts") as
        | { value: Product[]; setValue: (products: Product[]) => void }
        | undefined;
    const availableCategoriesContext = getContext("availableCategories") as
        | { value: string[] }
        | undefined;

    const selectedCategory = $derived(categoryContext?.value || "all");
    const selectedSubcategory = $derived(subcategoryContext?.value || "all");
    const allProducts = $derived(allProductsContext?.value || []);
    const availableCategories = $derived(
        availableCategoriesContext?.value || [],
    );

    // Filtered products based on selected category
    const filteredProducts = $derived(
        getProductsByCategory(allProducts, selectedCategory),
    );

    // Loading and error states (these will be managed by layout now)
    let loading = $state(false);
    let error = $state<string | null>(null);

    // Add new product
    function handleAddProduct(productData: {
        name: string;
        category: string;
        image: string;
    }) {
        if (!isValidImageUrl(productData.image)) {
            alert("Please enter a valid image URL");
            return;
        }

        const updatedProducts = addProduct(allProducts, productData);
        allProductsContext?.setValue(updatedProducts);
        updateUrlWithProducts(updatedProducts);
        closeAddModal();
    }

    // Share current products
    function shareProducts() {
        const shareUrl = getShareableUrl(allProducts);
        navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
                alert("Shareable link copied to clipboard!");
            })
            .catch(() => {
                prompt("Copy this link to share:", shareUrl);
            });
    }

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
    <!-- Action buttons -->
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800">Product Grid</h1>
        <div class="flex gap-3">
            <button
                on:click={shareProducts}
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    ></path>
                </svg>
                Share
            </button>
            <button
                on:click={openAddModal}
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                    ></path>
                </svg>
                Add Product
            </button>
        </div>
    </div>

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
            <!-- Product cards from URL data -->
            {#each filteredProducts as product}
                <div
                    class="aspect-square border border-gray-300 relative hover:border-blue-500 transition-colors duration-200 hover:shadow-lg cursor-pointer"
                    on:click={() => openModal(product)}
                    role="button"
                    tabindex="0"
                    on:keydown={(e) => e.key === "Enter" && openModal(product)}
                >
                    <div
                        class="w-full h-full bg-gray-200 flex items-center justify-center"
                    >
                        <img
                            src={product.image}
                            alt={product.name}
                            class="w-full h-full object-cover"
                            on:error={(e) => {
                                const img = e.target as HTMLImageElement;
                                if (img)
                                    img.src =
                                        "https://via.placeholder.com/400x400?text=Image+Not+Found";
                            }}
                        />
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
    {/if}
</div>

<!-- Modal component -->
<Modal
    isOpen={isModalOpen}
    onClose={closeModal}
    title={selectedProduct?.name || ""}
    description=""
    category={selectedProduct?.category || ""}
    image={selectedProduct?.image || ""}
/>

<!-- Add Product Modal -->
<AddProductModal
    isOpen={isAddModalOpen}
    onClose={closeAddModal}
    onSubmit={handleAddProduct}
    {availableCategories}
/>
