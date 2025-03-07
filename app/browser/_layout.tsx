import { Stack } from "expo-router";
import { PaperProvider, useTheme } from "react-native-paper";

export default function RootLayout() {
	const theme = useTheme();
	return (
		<PaperProvider theme={theme}>
			<Stack
				screenOptions={{
					headerShown: false,
					animation: "fade",
					contentStyle: { backgroundColor: theme.colors.background },
				}}
			/>
		</PaperProvider>
	);
}
