<script>
	import { themed } from '../theme';
	import Icon from './Icon.svelte';
	import Link from './Link.svelte';
	import Text from './Text.svelte';

	export let item;
	export let theme = '';
</script>

<li class={themed('MenuItem', [theme])}>
	<Link>
		<Icon icon={item.icon} />
		<Text text={item.name} weight={item.unread ? 'bold' : 'normal'} />
	</Link>
</li>
