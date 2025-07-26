<script lang="ts">
    import Modal from "$lib/Modal.svelte";
    import AddProductModal from "$lib/AddProductModal.svelte";
    import EditProductModal from "$lib/EditProductModal.svelte";
    import {
        getProductsByCategory,
        addProduct,
        deleteProduct,
        updateProduct,
        updateUrlWithProducts,
        isValidImageUrl,
        type Product,
    } from "$lib/urlData";
    import { getContext } from "svelte";

    // Modal state
    let isModalOpen = $state(false);
    let selectedProduct: Product | null = $state(null);

    // Add product modal state
    let isAddModalOpen = $state(false);

    // Edit product modal state
    let isEditModalOpen = $state(false);
    let productToEdit: Product | null = $state(null);

    // Edit mode state
    let isEditMode = $state(false);

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

    function openEditModal(product: Product) {
        productToEdit = product;
        isEditModalOpen = true;
        document.body.classList.add("modal-open");
    }

    function closeEditModal() {
        isEditModalOpen = false;
        productToEdit = null;
        document.body.classList.remove("modal-open");
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

    // Toggle edit mode
    function toggleEditMode() {
        isEditMode = !isEditMode;
    }

    // Delete product
    function handleDeleteProduct(productId: string) {
        if (confirm("Are you sure you want to delete this product?")) {
            const updatedProducts = deleteProduct(allProducts, productId);
            allProductsContext?.setValue(updatedProducts);
            updateUrlWithProducts(updatedProducts);
        }
    }

    // Edit product - open edit modal
    function handleEditProduct(product: Product) {
        openEditModal(product);
    }

    // Handle product update
    function handleUpdateProduct(
        productId: string,
        updatedData: { name: string; category: string; image: string },
    ) {
        if (!isValidImageUrl(updatedData.image)) {
            alert("Please enter a valid image URL");
            return;
        }

        const updatedProducts = updateProduct(
            allProducts,
            productId,
            updatedData,
        );
        allProductsContext?.setValue(updatedProducts);
        updateUrlWithProducts(updatedProducts);
        closeEditModal();
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
                on:click={toggleEditMode}
                class="{isEditMode
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-orange-500 hover:bg-orange-600'} text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                </svg>
                {isEditMode ? "Done" : "Edit"}
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
                    class="aspect-square border border-gray-300 relative hover:border-blue-500 transition-colors duration-200 hover:shadow-lg {isEditMode
                        ? ''
                        : 'cursor-pointer'}"
                    on:click={() => !isEditMode && openModal(product)}
                    role="button"
                    tabindex="0"
                    on:keydown={(e) =>
                        e.key === "Enter" && !isEditMode && openModal(product)}
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

                    <!-- Edit/Delete buttons - only show in edit mode -->
                    {#if isEditMode}
                        <div class="absolute top-2 right-2 flex gap-2">
                            <button
                                on:click|stopPropagation={() =>
                                    handleEditProduct(product)}
                                class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                                title="Edit product"
                            >
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    ></path>
                                </svg>
                            </button>
                            <button
                                on:click|stopPropagation={() =>
                                    handleDeleteProduct(product.id)}
                                class="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                                title="Delete product"
                            >
                                <svg
                                    class="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    ></path>
                                </svg>
                            </button>
                        </div>
                    {/if}

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

<!-- Edit Product Modal -->
<EditProductModal
    isOpen={isEditModalOpen}
    product={productToEdit}
    onClose={closeEditModal}
    onSubmit={handleUpdateProduct}
    {availableCategories}
/>
