<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/Sidebar.svelte";
	import TopBar from "$lib/TopBar.svelte";
	import { setContext } from "svelte";
	import { browser } from "$app/environment";
	import {
		decodeProductsFromUrl,
		encodeProductsToUrl,
		defaultProducts,
		type Product,
	} from "$lib/urlData";

	let { children } = $props();
	let selectedCategory = $state("all");
	let selectedSubcategory = $state("all");

	// Load products from URL parameters
	let allProducts = $state<Product[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	// Load products from URL when page loads or URL changes
	$effect(() => {
		if (browser) {
			loading = true;
			error = null;
			try {
				const urlParams = new URLSearchParams(window.location.search);
				const encodedData = urlParams.get("data");

				if (!encodedData) {
					// No data parameter, redirect to URL with default products
					const defaultEncodedData =
						encodeProductsToUrl(defaultProducts);
					const newUrl = new URL(window.location.href);
					newUrl.searchParams.set("data", defaultEncodedData);
					window.location.replace(newUrl.toString());
					return;
				}

				allProducts = decodeProductsFromUrl(encodedData);
			} catch (err) {
				error =
					err instanceof Error
						? err.message
						: "Failed to load products";
				console.error("Error loading products:", err);
			} finally {
				loading = false;
			}
		}
	});

	// Get unique categories from existing products
	const availableCategories = $derived(
		Array.from(
			new Set(allProducts.map((product) => product.category)),
		).sort(),
	);

	// Set contexts for child components
	setContext("selectedCategory", {
		get value() {
			return selectedCategory;
		},
		set value(v) {
			selectedCategory = v;
		},
	});

	setContext("selectedSubcategory", {
		get value() {
			return selectedSubcategory;
		},
		set value(v) {
			selectedSubcategory = v;
		},
	});

	setContext("allProducts", {
		get value() {
			return allProducts;
		},
		setValue(products: Product[]) {
			allProducts = products;
		},
	});

	setContext("availableCategories", {
		get value() {
			return availableCategories;
		},
	});
</script>

<div class="flex h-screen bg-gray-50">
	<Sidebar bind:selectedCategory {availableCategories} />
	<main class="flex-1 flex flex-col overflow-hidden">
		<TopBar {selectedCategory} bind:selectedSubcategory />
		<div class="flex-1 overflow-y-auto">
			{@render children()}
		</div>
	</main>
</div>
