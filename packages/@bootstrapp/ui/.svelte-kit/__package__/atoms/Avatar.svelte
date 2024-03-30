<script>
	import { themed } from '../theme';
	export let src;
	export let alt = 'Avatar';
	export let size = 10;
	export let theme = '';
</script>

<img class={themed('Avatar', [`object-cover h-${size} w-${size}`, theme])} {src} {alt} />
