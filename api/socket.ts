import CONFIG from "@/config";
import { io } from "socket.io-client";

class SocketSingleton {
	static instance: SocketSingleton;
	socket: any;
	constructor() {
		if (!SocketSingleton.instance) {
			this.socket = io(CONFIG.SERVER_HOST, {
				transports: ["websocket"],
				autoConnect: false,
			});
			SocketSingleton.instance = this;
		}
		return SocketSingleton.instance;
	}
	getSocket() {
		return this.socket;
	}
}

const socketInstance = new SocketSingleton().getSocket();

export default socketInstance;
