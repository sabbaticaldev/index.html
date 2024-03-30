<script>
	import { themed } from '../theme';
	export let theme = '';
</script>

<div
	class={themed('Spinner', [
		'border-gray-300 h-10 w-10 animate-spin rounded-full border-8 border-t-blue-600',
		theme
	])}
/>
