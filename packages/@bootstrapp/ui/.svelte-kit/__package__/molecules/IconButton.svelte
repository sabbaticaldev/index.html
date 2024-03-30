<script>
	import { themed } from '../theme';
	import Icon from '../atoms/Icon.svelte';

	export let icon;
	export let onClick = null;
	export let theme = '';
</script>

<button class={themed('IconButton', [theme])} on:click={onClick}>
	<Icon {icon} />
</button>
