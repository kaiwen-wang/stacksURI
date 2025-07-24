<script lang="ts">
    export let isOpen = false;
    export let onClose: () => void;

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
    <!-- Blank content area -->
    <div class="p-8 h-full flex items-center justify-center">
        <div class="text-center text-gray-400">
            <p class="text-lg">Blank page content</p>
            <p class="text-sm mt-2">This is where content will be displayed</p>
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
