import useRequest from "@/api/request";
import socketInstance from "@/api/socket";
import CustomHeader from "@/components/default/header/customheader";
import { useGlobalToast } from "@/hooks/useToast";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	Icon,
	Portal,
	Text,
	useTheme,
	Modal,
	ActivityIndicator,
} from "react-native-paper";
import { useQuery } from "react-query";

async function getAvailableClients() {
	return await useRequest({
		url: "/clients",
		method: "GET" as const,
		payload: null,
	});
}

export default function Index() {
	const router = useRouter();
	const theme = useTheme();
	const param = useSearchParams();
	const type = param.get("type") as string;
	const book_id = param.get("book_id") as string;
	const [clients, setClients] = useState<any>([]);
	const [modalVisible, setModalVisible] = useState(false);
	const { showToast } = useGlobalToast();
	const { user } = useAuth();
	useEffect(() => {
		socketInstance.onAny((event = "", ...args: any[]) => {
			console.log(`Received event: ${event}`, args);
		});
		socketInstance.on("connect", () => {
			console.log("Socket connected:", socketInstance.id);
		});
		socketInstance.on("request_denied", (message: string) => {
			setModalVisible(false);
			router.replace("/transaction");
			showToast(`Your ${type} request was denied`, "error");
		});
		socketInstance.on("request_approved", () => {
			setModalVisible(false);
			router.replace("/transaction");
			showToast(`Your ${type} request was accepted`, "success");
		});
		socketInstance.on("request_timed_out", (message: string) => {
			setModalVisible(false);
			router.replace("/transaction");
			showToast(`Your ${type} request timed out`, "warning");
		});
		socketInstance.connect();

		return () => {
			socketInstance.disconnect();
		};
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

	// get available clients
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
		console.log(payload);
		socketInstance.emit("request", payload);
		setModalVisible(true);
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<CustomHeader
				back
				onClick={() => router.replace("/transaction" as any)}
			/>
			<Portal>
				<Modal
					onDismiss={() => setModalVisible(false)}
					dismissable
					dismissableBackButton
					visible={modalVisible}
					contentContainerStyle={{
						justifyContent: "center",
						alignItems: "center",
					}}>
					<View
						style={{
							backgroundColor: theme.colors.background,
							width: 300,
							height: 200,
							alignItems: "center",
							justifyContent: "center",
							gap: 20,
							borderRadius: 10,
							borderColor: theme.colors.outlineVariant,
							borderWidth: 1,
						}}>
						<Text variant="titleLarge">Borrowing...</Text>
						<ActivityIndicator animating size={"large"} />
					</View>
				</Modal>
			</Portal>
			<ScrollView>
				<View style={{ flex: 1, padding: 20, gap: 20 }}>
					{clients.length === 0 && (
						<View
							style={{
								width: "100%",
								height: 400,
								justifyContent: "center",
								alignItems: "center",
							}}>
							<Text
								style={{ color: theme.colors.outlineVariant }}
								variant="titleLarge">
								No clients available
							</Text>
							<Icon
								color={theme.colors.outlineVariant}
								source="emoticon-sad-outline"
								size={100}
							/>
						</View>
					)}
					{clients.map(([clientId, client]: any) => (
						<ClientButton
							keyID={clientId}
							key={clientId}
							client={client}
							onClick={handleClientPress}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	);
}

function ClientButton({
	client,
	onClick,
	keyID,
}: {
	client: any;
	onClick: any;
	keyID: any;
}) {
	const theme = useTheme();
	const handleClick = () => {
		if (client?.busy) {
			alert("Client is busy");
		}
		onClick(keyID);
	};
	return (
		<TouchableOpacity onPress={handleClick}>
			<View
				style={{
					width: "100%",
					borderWidth: 1,
					borderColor: theme.colors.outlineVariant,
					height: 100,
					borderRadius: 10,
					padding: 10,
					flexDirection: "row",
					gap: 20,
				}}>
				<Image
					source={
						client?.picture
							? { uri: client?.picture }
							: require("@/assets/images/default/user_photo.png")
					}
					style={{
						height: 75,
						width: 75,
						borderRadius: 5,
						resizeMode: "contain",
					}}
				/>
				<View>
					<Text
						variant="bodyLarge"
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{ fontWeight: "bold", width: 200 }}>
						{`${
							client?.first_name.toLowerCase().charAt(0).toUpperCase() +
							client?.first_name.toLowerCase().slice(1)
						}${
							client?.last_name.toLowerCase().charAt(0).toUpperCase() +
							client?.last_name.toLowerCase().slice(1)
						}`}
					</Text>
					<Text
						variant="bodyLarge"
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{ opacity: 0.5, width: 200 }}>
						{`${keyID.toUpperCase()}`}
					</Text>
					<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
						<Icon
							size={20}
							source={"access-point"}
							color={client?.busy ? "#f44336" : "#4caf50"}
						/>
						<Text
							variant="bodyLarge"
							numberOfLines={1}
							ellipsizeMode="tail"
							style={{ opacity: 0.5, width: 200 }}>
							{client?.busy ? "BUSY" : "AVAILABLE"}
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}
