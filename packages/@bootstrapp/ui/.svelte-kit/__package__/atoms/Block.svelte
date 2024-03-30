<script>
	import { themed } from '../theme';
	export let theme = '';
</script>

<div class={themed('Block', [theme])}>
	<slot />
</div>
