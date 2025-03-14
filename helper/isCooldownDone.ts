export default function isCooldownDone(cooldown: number, lastUsedString: string): boolean {
	const lastUsed = new Date(lastUsedString).getTime();
	const cooldownDays = cooldown * 24 * 60 * 60 * 1000;
  	return Date.now() - lastUsed > cooldownDays;
}