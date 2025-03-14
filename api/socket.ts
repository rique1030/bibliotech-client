import { getURL } from "@/api/request"
import { io } from "socket.io-client";



class SocketSingleton {
	static instance: SocketSingleton;
	socket: any;

	constructor(config) {
		if (!config || !config.HOST) {
			throw new Error("Invalid configuration: HOST is undefined");
		}

		this.socket = io(config.HOST, {
			transports: ["websocket"],
			autoConnect: false,
		});
	}

	static async getInstance() { 
		if (!SocketSingleton.instance) {
			const config = await getURL();
			SocketSingleton.instance = new SocketSingleton(config);
		}
		return SocketSingleton.instance;
	}

	getSocket() {
		return this.socket;
	}
}

async function socketInstance() { 
 const instance = await SocketSingleton.getInstance()
 return instance.getSocket()
}

export default socketInstance;
