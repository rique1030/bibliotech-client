import { useAuth } from "@/providers/AuthProvider";
import { useFocusEffect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

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
		</View>
	);
}

const styles = StyleSheet.create({
	logo: { width: 100, height: 100, resizeMode: "contain" },
});
