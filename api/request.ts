import axios from "axios";

interface Response {
	data: any;
	error: any;
	message: any;
}

interface OptionsInterface {
	method: "GET" | "POST";
	url: string;
	headers: {
		"Content-Type": string;
	};
	data: any;
}

interface RequestInterface {
	url: string;
	method?: "GET" | "POST";
	payload?: any;
}

let config: any = null;

export const getURL = async () => {
	if (!config) {
		let options: OptionsInterface = {
			method: "GET",
			url: "https://api.jsonbin.io/v3/b/67caa550e41b4d34e4a2436a",
			headers: { "Content-Type": "application/json" },
			data: undefined,
		};
		try {
			const response: Response = await axios(options);
			config = Object.freeze(response.data.record.data);
		} catch {
			console.error("failed to fetch server url");
		}
	}
	return config;
};

const useRequest = async ({
	url,
	method = "GET",
	payload = null,
}: RequestInterface) => {
	const urlConfig = await getURL();
	if (!urlConfig) {
		alert("Missing Server");
		return;
	}
	let options: OptionsInterface = {
		method,
		url: urlConfig.HOST + url,
		headers: { "Content-Type": "application/json" },
		data: method === "POST" ? payload : undefined,
	};
	try {
		const response: Response = await axios(options);
		return {
			data: response.data?.data || response.data || null,
			success: response.data?.success || false,
			error: response.data?.error || null,
			message: response.data?.message || null,
		};
	} catch (error: any) {
		return {
			data: null,
			success: false,
			error: error.code,
			message: null,
		};
	}
};

export default useRequest;
