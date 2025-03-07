import CustomHeader from "@/components/default/header/customheader";
import { useRouter } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { useTheme, Text, Button, Icon } from "react-native-paper";

const styles = StyleSheet.create({
	mainWindow: {
		width: "100%",
		height: "100%",
		padding: 20,
		alignItems: "center",
	},
	NavigationButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		width: "100%",
	},
});

export default function Index() {
	const router = useRouter();
	const theme = useTheme();
	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<CustomHeader />
			<View
				style={[
					styles.mainWindow,
					{ backgroundColor: "rgba(0, 0, 0, 0.1)", gap: 20 },
				]}>
				<TouchableOpacity
					onPress={() =>
						router.push(
							`/scan?${new URLSearchParams({
								type: "borrow",
							}).toString()}` as any
						)
					}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 10,
							backgroundColor: theme.colors.background,
							padding: 20,
							borderRadius: 10,
							borderColor: theme.colors.outlineVariant,
							borderWidth: 1,
						}}>
						<Icon source="qrcode-plus" size={70} color={theme.colors.primary} />
						<View
							style={{
								gap: 5,
								width: 200,
								flexDirection: "column",
								height: "100%",
							}}>
							<Text
								variant="bodyLarge"
								style={{ color: theme.colors.primary, fontWeight: "bold" }}>
								Borrow Book
							</Text>
							<Text
								variant="bodySmall"
								style={{ color: "gray", fontWeight: "bold" }}>
								Scan a book's QR code to quickly add it to your borrowing list.
							</Text>
						</View>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() =>
						router.push(
							`/scan?${new URLSearchParams({
								type: "return",
							}).toString()}` as any
						)
					}>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							gap: 10,
							backgroundColor: theme.colors.background,
							padding: 20,
							borderRadius: 10,
							borderColor: theme.colors.outlineVariant,
							borderWidth: 1,
						}}>
						<Icon
							source="qrcode-minus"
							size={70}
							color={theme.colors.primary}
						/>
						<View
							style={{
								gap: 5,
								width: 200,
								flexDirection: "column",
								height: "100%",
							}}>
							<Text
								variant="bodyLarge"
								style={{ color: theme.colors.primary, fontWeight: "bold" }}>
								Return Book
							</Text>
							<Text
								variant="bodySmall"
								style={{ color: "gray", fontWeight: "bold" }}>
								Scan a book's QR code to quickly remove it from your borrowing
								list.
							</Text>
						</View>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}
