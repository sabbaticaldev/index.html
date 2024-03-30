<script>
	import { themed } from '../theme';
	export let icon;
	export let svg = {
		clipRule: false,
		viewBox: '0 0 24 24',
		stroke: 'currentColor',
		fill: 'none',
		path: '',
		'stroke-linecap': 'round',
		'stroke-linejoin': 'round',
		'stroke-width': '2'
	};
	export let theme = '';
</script>

{#if icon}{:else}
	<svg class={themed('Icon', [theme])} xmlns="http://www.w3.org/2000/svg" {...svg}>
		<path d={svg.path} {...svg?.clipRule ? { 'clip-rule': clipRule } : {}} />
	</svg>
{/if}
