<script>
	import { themed } from '../theme';
	export let theme = '';
	export let online = false;
</script>

<div class={themed('StatusIndicator', ['indicator ', theme])}>
	<span
		class="indicator-item indicator-middle indicator-start badge badge- ${online
			? 'primary'
			: 'accent'}"
	/>
	<div class="grid w-32 h-32 place-items-center"><slot /></div>
</div>
