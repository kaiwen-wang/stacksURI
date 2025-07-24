<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/Sidebar.svelte";
	import TopBar from "$lib/TopBar.svelte";
	import { setContext } from "svelte";

	let { children } = $props();
	let selectedCategory = $state("all");
	let selectedSubcategory = $state("all");

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
</script>

<div class="flex h-screen bg-gray-50">
	<Sidebar bind:selectedCategory />
	<main class="flex-1 flex flex-col overflow-hidden">
		<TopBar {selectedCategory} bind:selectedSubcategory />
		<div class="flex-1 overflow-y-auto">
			{@render children()}
		</div>
	</main>
</div>
