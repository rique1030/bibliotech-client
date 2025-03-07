export default function Alpha(color: string, alpha: number) {
	const r = parseInt(color.slice(1, 3), 16);
	const g = parseInt(color.slice(3, 5), 16);
	const b = parseInt(color.slice(5, 7), 16);
	const a = Math.max(0, Math.min(1, alpha));
	return `rgba(${r}, ${g}, ${b}, ${a})`;
}
