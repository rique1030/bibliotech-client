import useCustomTheme from "@/hooks/useCustomTheme";
import useToast, { GlobalToast, Toast } from "@/hooks/useToast";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import React, { useContext, useEffect, useMemo } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
	configureFonts,
	Drawer,
	Icon,
	PaperProvider,
	useTheme,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "react-query";
import { Drawer as ExpoDrawer } from "expo-router/drawer";
import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerItemList,
} from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 1000 * 60 * 5,
		},
	},
});

export default function RootLayout() {
	const { theme } = useCustomTheme();
	const toastState = useToast();

	useEffect(() => {
		NavigationBar.setVisibilityAsync("hidden");
	}, []);

	const [loaded] = useFonts({
		InriaSans: require("@/assets/fonts/InriaSans-Regular.ttf"),
		InriaSansBold: require("@/assets/fonts/InriaSans-Bold.ttf"),
		InriaSansItalic: require("@/assets/fonts/InriaSans-Italic.ttf"),
		InriaSansLight: require("@/assets/fonts/InriaSans-Light.ttf"),
		InriaSansLightItalic: require("@/assets/fonts/InriaSans-LightItalic.ttf"),
	});

	const contextValue = useMemo(
		() => ({ ...toastState }),
		[toastState.showToast]
	);

	const baseFont = {
		fontFamily: "InriaSans",
	} as const;

	const baseVariants = configureFonts({ config: baseFont });

	const customVariants = {
		displayMedium: {
			...baseVariants.displayMedium,
			fontFamily: "InriaSans",
		},
		bold: {
			...baseVariants.bodyMedium,
			fontFamily: "InriaSans",
		},
		italic: {
			...baseVariants.bodyMedium,
			fontFamily: "InriaSansItalic",
		},
		boldItalic: {
			...baseVariants.bodyMedium,
			fontFamily: "InriaSansItalic",
		},
	} as const;

	const fonts = configureFonts({
		config: {
			...baseVariants,
			...customVariants,
		},
	});

	if (!loaded) return null;
	return (
		<GestureHandlerRootView>
			<StatusBar hidden />
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<PaperProvider theme={{ ...theme, fonts }}>
						<GlobalToast.Provider value={{ ...contextValue }}>
							<View
								style={{ flex: 1, backgroundColor: theme.colors.background }}>
								<ExpoDrawer
									initialRouteName="index"
									drawerContent={CustomDrawerContent}
									screenOptions={{
										headerShown: false,
										drawerActiveTintColor: theme.colors.primary,
										drawerInactiveTintColor: "gray",
										drawerStyle: {
											backgroundColor: theme.colors.background,
											paddingTop: 50,
										},
									}}>
									<ExpoDrawer.Screen
										name="browser"
										options={{
											headerShown: false,
											title: "Search",
											drawerIcon: ({ color, size }) => (
												<Icon source={"magnify"} color={color} size={24} />
											),
										}}
									/>
									<ExpoDrawer.Screen
										name="index"
										options={{
											drawerItemStyle: { display: "none" }, // ✅ Hide from the drawer
										}}
									/>
									<ExpoDrawer.Screen
										name="auth"
										options={{
											drawerItemStyle: { display: "none" }, // ✅ Hide from the drawer
										}}
									/>
									<ExpoDrawer.Screen
										name="book_profile"
										options={{
											drawerItemStyle: { display: "none" }, // ✅ Hide from the drawer
										}}
									/>
									<ExpoDrawer.Screen
										name="scan"
										options={{
											drawerItemStyle: { display: "none" }, // ✅ Hide from the drawer
										}}
									/>
									<ExpoDrawer.Screen
										name="request"
										options={{
											drawerItemStyle: { display: "none" }, // ✅ Hide from the drawer
										}}
									/>
									<ExpoDrawer.Screen
										name="transaction"
										options={{
											headerShown: false,
											title: "Transactions",
											drawerIcon: ({ color, size }) => (
												<Icon source={"qrcode-scan"} color={color} size={24} />
											),
										}}
									/>
									<ExpoDrawer.Screen
										name="profile"
										options={{
											headerShown: false,
											title: "Profile",
											drawerIcon: ({ color, size }) => (
												<Icon source={"account-box"} color={color} size={24} />
											),
										}}
									/>
								</ExpoDrawer>
								<Toast />
							</View>
						</GlobalToast.Provider>
					</PaperProvider>
				</AuthProvider>
			</QueryClientProvider>
		</GestureHandlerRootView>
	);
}

function CustomDrawerContent(props: any) {
	const theme = useTheme();
	const { logout } = useAuth();
	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView
				style={{ flex: 1, paddingHorizontal: 0 }}
				{...props}>
				<DrawerItemList {...props}></DrawerItemList>
			</DrawerContentScrollView>
			<DrawerItem
				icon={() => (
					<Icon source="logout" color={theme.colors.error} size={24} />
				)}
				style={{
					bottom: 16,
					borderRadius: 56, // Adjust the value as needed
					marginHorizontal: 10, // Optional: add some horizontal margin if required
					overflow: "hidden",
				}}
				labelStyle={{
					color: theme.colors.error,
				}}
				label="Logout"
				onPress={logout}
			/>
		</View>
	);
}
