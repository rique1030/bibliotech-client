import CONFIG from "../config";

export function convertCover(cover: string): string {
	if (cover === "default" || !cover) {
		return "";
	}
	return `${CONFIG.SERVER_HOST}/images/book_covers/${cover}.png`;
}

export function convertProfile(profile: string): string {
	if (profile === "default" || !profile) {
		return "";
	}
	return `${CONFIG.SERVER_HOST}/images/user_photos/${profile}.png`;
}

export function convertQRCode(qrCode: string | null): string {
	if (!qrCode) return "";
	return `${CONFIG.SERVER_HOST}/qr-codes/${qrCode}.png`;
}
