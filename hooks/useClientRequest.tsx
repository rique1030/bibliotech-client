import useRequest from "@/api/request";
import socketInstance from "@/api/socket";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useGlobalToast } from "./useToast";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "react-query";
import * as Notifications from 'expo-notifications';

async function getAvailableClients() {
	return await useRequest({
		url: "/clients",
		method: "GET" as const,
		payload: null,
	});
}

export default function useClientRequest(type: string, book_id: string) {
	const router = useRouter();
	const [clients, setClients] = useState<any>([]);
	const [modalVisible, setModalVisible] = useState<boolean>(false);
	const { showToast } = useGlobalToast();
	const { user } = useAuth();

	useEffect(() => {
		const setupSocket = async () => {
			const socket = await socketInstance(); 
			if (!socket) return;
			socket.on("request_denied", (message: string) => {
				setModalVisible(false);
				router.replace("/transaction");
				showToast(`Your ${type} request was denied. \nReason: ${message}`, "error");
			});
			socket.on("request_approved", () => {
				setModalVisible(false);
				router.replace("/transaction");
				showToast(`Your ${type} request was accepted`, "success");
			});
			socket.on("request_timed_out", (message: string) => {
				setModalVisible(false);
				router.replace("/transaction");
				showToast(`Your ${type} request timed out`, "warning");
			});
			socket.connect();	
		};
		setupSocket()
		return () => {
			socketInstance().then((socket) => {
				socket?.disconnect()
			})
		}
	}, []);


	const { data: available_clients, refetch: refetch_available_clients } =
		useQuery({
			queryKey: ["available_clients"],
			queryFn: () => {
				return getAvailableClients();
			},
			retry: 2,
			refetchInterval: 5000,
			staleTime: 0,
		});
	useEffect(() => {
		refetch_available_clients();
	}, []);

	useEffect(() => {
		if (!available_clients?.data) return;
		setClients(Object.entries(available_clients?.data) || []);
	}, [available_clients]);

	const handleClientPress = (clientID: string) => {
		const payload = {
			receiver_id: clientID,
			borrow: type === "borrow",
			book_id: book_id,
			user_id: user?.id,
		};
		socketInstance().then((socket) => {
			socket?.emit("request", payload);
		})
		setModalVisible(true);
	};
	return {
		clients,
		modalVisible,
		setModalVisible,
		handleClientPress,
	};
}
