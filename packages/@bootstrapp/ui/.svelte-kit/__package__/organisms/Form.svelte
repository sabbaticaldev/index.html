<script>
	import { themed } from '../theme';
	export let onSubmit = () => {};
	export let theme = '';
</script>

<form on:submit={onSubmit} class={themed('Form', [theme])}>
	<slot />
</form>
