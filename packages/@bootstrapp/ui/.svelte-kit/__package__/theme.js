import { getContext } from 'svelte';

export const themed = (field, themes = []) => {
	let themeContext = getContext('theme');
	let defaultTheme = themeContext?.[field];
	themes.push(defaultTheme);
	return themes.filter((theme) => !!theme).join(' ');
};
