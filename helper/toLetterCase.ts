export default function toLetterCase(str: string) {
	return str.replace(
		/\w\S*/g,
		(txt) =>
			txt.charAt(0).toLocaleUpperCase() + txt.slice(1).toLocaleLowerCase()
	);
}
