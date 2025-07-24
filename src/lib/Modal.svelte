<script lang="ts">
    export let isOpen = false;
    export let onClose: () => void;
    export let title = "";
    export let description = "";
    export let price = "";
    export let category = "";
    export let image = "";

    let dialog: HTMLDialogElement;

    // Watch for isOpen changes and show/hide dialog accordingly
    $: {
        console.log(
            "Modal isOpen changed:",
            isOpen,
            "dialog exists:",
            !!dialog,
        );
        if (dialog) {
            if (isOpen) {
                console.log("Showing modal");
                dialog.showModal();
                document.body.classList.add("modal-open");
            } else {
                console.log("Hiding modal");
                dialog.close();
                document.body.classList.remove("modal-open");
            }
        }
    }

    // Handle dialog close events
    function handleClose() {
        onClose();
    }

    // Close modal when clicking on backdrop
    function handleBackdropClick(event: MouseEvent) {
        if (event.target === dialog) {
            onClose();
        }
    }
</script>

<!-- Native HTML dialog element -->
<dialog
    bind:this={dialog}
    onclose={handleClose}
    onclick={handleBackdropClick}
    class="bg-white shadow-xl max-w-lg w-full h-[600px] p-0 border-0 z-50"
    style="z-index: 9999; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);"
>
    <!-- Content area -->
    <div class="p-8 h-full overflow-y-auto">
        {#if title || price || category || image}
            <div class="space-y-6">
                <!-- Image section -->
                {#if image}
                    <div class="flex justify-center">
                        <img
                            src={image}
                            alt={title}
                            class="w-48 h-48 object-contain rounded-lg"
                        />
                    </div>
                {/if}

                <!-- Title -->
                {#if title}
                    <h2 class="text-2xl font-bold text-gray-900 text-center">
                        {title}
                    </h2>
                {/if}

                <!-- Category -->
                {#if category}
                    <div class="text-center">
                        <span
                            class="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                        >
                            {category}
                        </span>
                    </div>
                {/if}

                <!-- Price -->
                {#if price}
                    <div class="text-center">
                        <span class="text-3xl font-bold text-green-600">
                            ${price}
                        </span>
                    </div>
                {/if}

                <!-- Description -->
                {#if description && description.trim()}
                    <div class="text-gray-700 leading-relaxed">
                        <h3 class="text-lg font-semibold mb-2">Description</h3>
                        <p>{description}</p>
                    </div>
                {/if}
            </div>
        {:else}
            <!-- Fallback content when no data is provided -->
            <div class="h-full flex items-center justify-center">
                <div class="text-center text-gray-400">
                    <p class="text-lg">No content to display</p>
                    <p class="text-sm mt-2">
                        Please provide title, description, or other information
                    </p>
                </div>
            </div>
        {/if}
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
