<script>
	import { themed } from '../theme';
	export let text = null;
	export let heading = null;
	export let article = false;
	export let section = false;

	export let theme = '';
	let element;

	const tags = {
		heading: heading >= 1 && heading <= 6 ? 'h' + heading : null,
		article: article ? 'article' : null,
		section: section ? 'section' : null
	};

	element = Object.values(tags).find(Boolean) || 'p';
</script>

<svelte:element this={element} class={themed('Text', [theme])}>
	{#if text !== null}
		{text}
	{:else}
		<slot />
	{/if}
</svelte:element>
