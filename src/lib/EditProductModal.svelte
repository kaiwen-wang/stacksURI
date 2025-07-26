<script lang="ts">
    import { isValidImageUrl, type Product } from "$lib/urlData";

    export let isOpen = false;
    export let product: Product | null = null;
    export let availableCategories: string[] = [];
    export let onClose: () => void;
    export let onSubmit: (
        productId: string,
        updatedData: { name: string; category: string; image: string },
    ) => void;

    let dialog: HTMLDialogElement;
    let formData = {
        name: "",
        category: "clothing",
        image: "",
    };
    let isCreatingNewCategory = false;
    let newCategoryName = "";

    // Watch for isOpen changes and show/hide dialog accordingly
    $: {
        if (dialog) {
            if (isOpen) {
                dialog.showModal();
                document.body.classList.add("modal-open");
            } else {
                dialog.close();
                document.body.classList.remove("modal-open");
            }
        }
    }

    // Update form when product changes
    $: {
        if (product) {
            formData = {
                name: product.name,
                category: product.category,
                image: product.image,
            };
            isCreatingNewCategory = false;
            newCategoryName = "";
        }
    }

    // Handle dialog close events
    function handleClose() {
        resetForm();
        onClose();
    }

    // Close modal when clicking on backdrop
    function handleBackdropClick(event: MouseEvent) {
        if (event.target === dialog) {
            handleClose();
        }
    }

    // Reset form data
    function resetForm() {
        formData = {
            name: "",
            category: "clothing",
            image: "",
        };
        isCreatingNewCategory = false;
        newCategoryName = "";
    }

    // Handle form submission
    function handleSubmit(event: Event) {
        event.preventDefault();

        if (!product) return;

        // Use new category name if creating a new category
        const categoryToUse = isCreatingNewCategory
            ? newCategoryName.toLowerCase().trim()
            : formData.category;

        if (isCreatingNewCategory && !newCategoryName.trim()) {
            alert("Please enter a category name");
            return;
        }

        if (!isValidImageUrl(formData.image)) {
            alert("Please enter a valid image URL");
            return;
        }

        onSubmit(product.id, {
            name: formData.name.trim(),
            category: categoryToUse,
            image: formData.image.trim(),
        });
        resetForm();
    }
</script>

<!-- Native HTML dialog element -->
<dialog
    bind:this={dialog}
    on:close={handleClose}
    on:click={handleBackdropClick}
    class="bg-white shadow-xl max-w-lg w-full h-[600px] p-0 border-0 z-50"
    style="z-index: 9999; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
>
    <!-- Content area -->
    <div class="p-8 h-full overflow-y-auto">
        <div class="space-y-6">
            <!-- Title -->
            <h2 class="text-2xl font-bold text-gray-900 text-center">
                Edit Product
            </h2>

            <!-- Form -->
            <form on:submit={handleSubmit} class="space-y-4">
                <div>
                    <label
                        for="edit-name"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Product Name
                    </label>
                    <input
                        id="edit-name"
                        type="text"
                        bind:value={formData.name}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter product name"
                        required
                    />
                </div>

                <div>
                    <label
                        for="edit-category"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Category
                    </label>

                    <!-- Toggle between existing and new category -->
                    <div class="flex items-center gap-4 mb-2">
                        <label class="flex items-center">
                            <input
                                type="radio"
                                bind:group={isCreatingNewCategory}
                                value={false}
                                class="mr-2"
                            />
                            <span class="text-sm">Select existing</span>
                        </label>
                        <label class="flex items-center">
                            <input
                                type="radio"
                                bind:group={isCreatingNewCategory}
                                value={true}
                                class="mr-2"
                            />
                            <span class="text-sm">Create new</span>
                        </label>
                    </div>

                    {#if isCreatingNewCategory}
                        <!-- New category input -->
                        <input
                            type="text"
                            bind:value={newCategoryName}
                            placeholder="Enter new category name"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    {:else}
                        <!-- Existing category dropdown -->
                        <select
                            id="edit-category"
                            bind:value={formData.category}
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {#each availableCategories as category}
                                <option value={category}
                                    >{category.charAt(0).toUpperCase() +
                                        category.slice(1)}</option
                                >
                            {/each}
                            <!-- Default options if no categories exist -->
                            {#if availableCategories.length === 0}
                                <option value="clothing">Clothing</option>
                                <option value="electronics">Electronics</option>
                                <option value="software">Software</option>
                            {/if}
                        </select>
                    {/if}
                </div>

                <div>
                    <label
                        for="edit-image"
                        class="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Image URL
                    </label>
                    <input
                        id="edit-image"
                        type="url"
                        bind:value={formData.image}
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                        required
                    />
                    <p class="text-xs text-gray-500 mt-1">
                        Enter a URL to an image hosted on another website
                    </p>
                </div>

                <div class="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        on:click={handleClose}
                        class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Update Product
                    </button>
                </div>
            </form>
        </div>
    </div>
</dialog>

<style>
    /* Ensure modal appears above other content */
    :global(body.modal-open) {
        overflow: hidden;
    }

    /* Custom backdrop styling */
    dialog::backdrop {
        background: rgba(150, 150, 150, 0.3);
    }
</style>
