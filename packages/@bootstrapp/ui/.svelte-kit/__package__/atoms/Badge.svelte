<script>
	import { themed } from '../theme';
	export let count = 0;
	export let theme = '';
</script>

{#if count}
	<span class={themed('Badge', ['flex items-center justify-center', theme])}>
		{count}
	</span>
{/if}
