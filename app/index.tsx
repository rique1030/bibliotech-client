import { useAuth } from "@/providers/AuthProvider";
import { View, Image, StyleSheet } from "react-native";
import { useTheme, ActivityIndicator } from "react-native-paper";

export default function Index() {
	const theme = useTheme();
	const _auth = useAuth();

	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: theme.colors.background,
			}}>
			<Image
				source={require("@/assets/images/default/Logo.png")}
				style={styles.logo}
			/>
			<ActivityIndicator style={{ padding: 50 }} size="large" color={theme.colors.primary} />
		</View>
	);
}

const styles = StyleSheet.create({
	logo: { width: 100, height: 100, resizeMode: "contain" },
});
