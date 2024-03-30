<script>
	import { themed } from '../theme';
	export let cols = 1;
	export let gap = 0;
	export let theme = '';

	let colClasses =
		typeof cols === 'object'
			? Object.entries(cols)
					.map(([bp, val]) => `${bp}:grid-cols-${val}`)
					.join(' ')
			: `grid-cols-${cols}`;

	let gapClasses =
		typeof gap === 'object'
			? Object.entries(gap)
					.map(([bp, val]) => `${bp}:gap-${val}`)
					.join(' ')
			: `gap-${gap}`;
</script>

<div class={themed('Grid', ['grid', colClasses, gapClasses, theme])}>
	<slot />
</div>
