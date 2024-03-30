<script>
	import { themed } from '../theme';
	import Spinner from '../atoms/Spinner.svelte';

	export let type = 'button';
	export let disabled = false;
	export let loading = false;
	export let text = '';
	export let selected = false;
	export let onClick = () => {};
	export let theme = '';
</script>

<button on:click={onClick} {type} class={themed('Button', ['btn', theme])} {disabled}>
	{#if loading}
		<Spinner size="20" />
	{:else if text}
		{text}
	{:else}
		<slot />
	{/if}
</button>
