import * as SecureStore from "expo-secure-store";

export const safeStore = async (key: string, value: any) => {
	await SecureStore.setItemAsync(key, JSON.stringify(value));
};

export const safeFetch = async (key: string) => {
	const item = await SecureStore.getItemAsync(key);
	return item ? JSON.parse(item) : null;
};

export const safeDelete = async (key: string) => {
	await SecureStore.deleteItemAsync(key);
};
