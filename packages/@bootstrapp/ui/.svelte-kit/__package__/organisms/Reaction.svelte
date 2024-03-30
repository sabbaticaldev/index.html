<script>
	import { themed } from '../theme';
	import List from '../molecules/List.svelte';
	import Text from '../atoms/Text.svelte';

	export let emoji = '';
	export let count = 0;
	export let onClick = () => {};
	export let theme = '';
</script>

<List theme={themed('Reaction', [theme])} events={{ click: () => onClick(emoji) }}>
	<Text theme="sm" text={emoji} />
	<Text theme="xs medium" text={count} />
</List>
