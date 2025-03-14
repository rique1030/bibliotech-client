import { getURL } from "@/api/request"

export async function convertCover(cover: string): Promise<string> {
	if (cover === "default" || !cover) {
		return "";
	}
	return `${(await getURL()).HOST}/images/book_covers/${cover}.png`;
}

export async function convertProfile(profile: string): Promise<string> {
	if (profile === "default" || !profile) {
		return "";
	}
	return `${(await getURL()).HOST}/images/user_photos/${profile}.png`;
}

