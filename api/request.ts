import axios from "axios";
import CONFIG from "@/config";

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

const useRequest = async ({
	url,
	method = "GET",
	payload = null,
}: RequestInterface) => {
	let options: OptionsInterface = {
		method,
		url: CONFIG.SERVER_HOST + url,
		headers: { "Content-Type": "application/json" },
		data: method === "POST" ? payload : undefined,
	};
	try {
		const response: Response = await axios(options);
		// console.log(response.data);
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
