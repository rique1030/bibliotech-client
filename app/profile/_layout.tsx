import { Stack } from "expo-router";
import { useTheme } from "react-native-paper";

export default function RootLayout() {
	const theme = useTheme();
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: theme.colors.background },
			}}
		/>
	);
}
