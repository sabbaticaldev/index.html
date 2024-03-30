<script>
	import { themed } from '../theme';
	export let href = '#';
	export let onAction = null;
	export let theme = '';
</script>

<a {href} on:click|preventDefault={onAction} class={themed('Link', [theme])}>
	<slot />
</a>
