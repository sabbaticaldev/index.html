<script>
	import { themed } from '../theme';
	export let type = 'text';
	export let placeholder = '';
	export let required = false;
	export let value = '';
	export let theme = '';
	export let onChange = () => {};
	export let bind = this;
	export let autofocus = false;

	let internalValue = value;
	$: value = internalValue;
</script>

<input
	{...{ type }}
	{placeholder}
	{required}
	bind:this={bind}
	bind:value={internalValue}
	class={themed('TextInput', [theme])}
	on:input={onChange}
/>
