import useRequest, { getURL } from "@/api/request";
import CustomHeader from "@/components/default/header/customheader";
import Alpha from "@/helper/alpha";
import { useGlobalToast } from "@/hooks/useToast";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, Button, useTheme, Chip } from "react-native-paper";
import { useQuery } from "react-query";

async function getBookByAccessNumber(accessNumbers: string[]) {
	return await useRequest({
		url: (await getURL()).API.COPIES.GET_BY_ACCESS,
		method: "POST" as const,
		payload: accessNumbers,
	});
}

export default function Index() {
	const theme = useTheme();
	const router = useRouter();
	const params = useSearchParams();
	const transaction = params.get("type") as string;
	const [facing, setFacing] = useState("back");
	const [permission, requestPermission] = useCameraPermissions();
	const [scanned, setScanned] = useState(false);
	const [accessNumbers, setAccessNumbers] = useState<string[]>([]);
	const { showToast } = useGlobalToast();
	const { data: book_data } = useQuery({
		queryKey: ["books", accessNumbers],
		queryFn: () => getBookByAccessNumber(accessNumbers),
		retry: 2,
		cacheTime: 0,
		staleTime: 0,
		enabled: accessNumbers.length > 0,
	});

	useEffect(() => {
		if (!book_data) return;

		if (book_data && book_data.success) {
			if (book_data.data.length === 0) {
				alert("No book found");
				return;
			}
			const current_book = book_data.data[0];
			if (!current_book) return;
			const borrow = transaction === "borrow";
			const status = current_book.status.toLowerCase();
			if (borrow && status === "borrowed") {
				showToast("This book is already borrowed by someone.", "error");
				return;
			} else if (!borrow && status === "available") {
				showToast(
					"This book is not borrowed. Please borrow it first.",
					"error"
				);
				return;
			} else if (status === "lost") {
				showToast(
					"This book is currently marked as lost. Please contact the librarian.",
					"error"
				);
				return;
			}
			router.push(
				`/request?${new URLSearchParams({
					type: transaction || "borrow",
					book_id: current_book?.id,
				}).toString()}`
			);
		}
	}, [book_data]);

	if (!permission?.status.toString() === ("granted" as any)) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: theme.colors.background,
					gap: 20,
				}}>
				<Text>We need your permission to show the camera</Text>
				<Button mode="contained" onPress={requestPermission}>
					Request Permission
				</Button>
			</View>
		);
	}
	function toggleFacing() {
		setFacing((current) => (current === "front" ? "back" : "front"));
	}
	const handleBarcodeScan = (data: any) => {
	if (scanned) return;
		setScanned(true);
		setAccessNumbers([data.data]);
		setTimeout(() => handleResetScan(), 2000);
	};

	const handleResetScan = () => {
		setAccessNumbers([]);
		setScanned(false)
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<CustomHeader back onClick={() => router.back()} />
			<CameraView
				style={{
					width: "100%",
					height: "100%",
					backgroundColor: "black",
					alignItems: "center",
				}}
				onBarcodeScanned={handleBarcodeScan}
				barcodeScannerSettings={{
					barcodeTypes: ["qr"],
				}}
				facing={facing as any}>
				<Chip
					mode="outlined"
					textStyle={{ color: theme.colors.primary }}
					style={{
						position: "absolute",
						top: 20,
						backgroundColor: Alpha(theme.colors.primary, 0.2),
						borderColor: theme.colors.primary,
						borderRadius: 50,
					}}>
					{transaction.toUpperCase()}
				</Chip>
				<Chip
					mode="outlined"
					textStyle={{ color: theme.colors.primary }}
					style={{
						position: "absolute",
						top: 70,
						backgroundColor: Alpha(theme.colors.primary, 0.2),
						borderColor: theme.colors.primary,
						borderRadius: 50,
					}}>
					Scanned Value: {accessNumbers?.[0] || "NONE"}
				</Chip>
			</CameraView>
		</View>
	);
}
