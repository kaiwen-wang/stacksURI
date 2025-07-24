<div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-8">Product Grid</h1>

    <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0"
    >
        <!-- Sample product cards -->
        {#each Array(12) as _, i}
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
                        Product {i + 1}
                    </h3>
                </div>
            </div>
        {/each}
    </div>
</div>
