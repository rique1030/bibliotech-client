import CustomHeader from "@/components/default/header/customheader";
import { Slot, useRouter } from "expo-router";
import { View } from "react-native";
import { useTheme } from "react-native-paper";

export default function RootLayout() {
	const router = useRouter();
	const theme = useTheme();
	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<CustomHeader back onClick={() => router.back()} />
			<Slot />
		</View>
	);
}
