import { Slot } from "expo-router";
import { View, Image, ScrollView } from "react-native";
import { Text, useTheme } from "react-native-paper";

const Logo = require("@/assets/images/default/Logo.png");

export default function RootLayout() {
	const theme = useTheme();
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: theme.colors.background,
			}}>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: 8,
					height: "20%",
				}}>
				<Image source={Logo} style={styles.logo} />
				<Text style={[styles.logoLabel, { color: theme.colors.onBackground }]}>Bibliotech</Text>
			</View>
			<View
				style={{
					width: "100%",
					height: "70%",
				}}>
				<Slot />
			</View>
		</View>
	);
}

const styles = {
	logo: {
		width: 50,
		height: 50,
		resizeMode: "contain" as const,
	},
	logoLabel: {
		fontSize: 36,
		fontWeight: "bold" as const,
	},
};
