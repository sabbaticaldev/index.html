<script>
	import { themed } from '../theme';
	export let vertical = false;
	export let events = {};
	export let theme = '';
	export let ordered = false;
	export let unordered = false;
	export let style = 'list-none';

	let element;

	function handleEvents(node) {
		Object.keys(events).forEach((event) => {
			node.addEventListener(event, events[event]);
		});
		return {
			destroy() {
				Object.keys(events).forEach((event) => {
					node.removeEventListener(event, events[event]);
				});
			}
		};
	}

	const tags = {
		ol: ordered ? 'ol' : null,
		ul: unordered ? 'ul' : null
	};

	element = Object.values(tags).find(Boolean) || 'div';
</script>

<svelte:element
	this={element}
	class={themed('List', ['flex', vertical && 'flex-col', (ordered || unordered) && style, theme])}
	use:handleEvents
>
	<slot />
</svelte:element>
