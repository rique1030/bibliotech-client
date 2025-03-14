import PasswordField from "@/components/default/textfield/password";
import { RelativePathString, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useContext, useEffect, useState } from "react";
import { View } from "react-native";
import {
	Button,
	Checkbox,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import { useAuth } from "@/providers/AuthProvider";

export default function Login() {
	const theme = useTheme();
	const router = useRouter();
	const { staySignedIn, setStaySignedIn, login, loading } = useAuth();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	useFocusEffect(
		useCallback(() => {
			setEmail("");
			setPassword("");
		}, [])
	);

	return (
		<View
			style={{
				flex: 1,
				paddingHorizontal: 40,
				gap: 16,
				justifyContent: "space-between",
			}}>
			<View style={{ flex: 1, gap: 50 }}>
				<View style={{ gap: 8 }}>
					<Text
						style={{ color: theme.colors.onBackground }}
						variant="headlineLarge">
						Welcome back!
					</Text>
					<Text style={{ color: theme.colors.outline }} variant="labelLarge">
						Sign In to Continue
					</Text>
				</View>
				<View style={{ gap: 16 }}>
					<TextInput
						value={email}
						onChangeText={setEmail}
						contentStyle={{ color: theme.colors.onBackground }}
						label="Email"
						mode="outlined"
					/>
					<PasswordField
						value={password}
						onChangeText={setPassword}
						label="Password"
					/>
					<View
						style={{
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
							width: "100%",
						}}>
						<Checkbox
							status={staySignedIn ? "checked" : "unchecked"}
							onPress={() => setStaySignedIn(!staySignedIn)}
						/>
						<Text style={{ color: theme.colors.outline }}>Stay Signed In</Text>
					</View>
				</View>
			</View>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Button
					disabled={loading}
					style={{ borderColor: theme.colors.primary }}
					mode="outlined"
					onPress={() => router.replace("/auth/signup")}>
					Sign Up
				</Button>
				<Button
					disabled={loading}
					onPress={() =>
						login(email, password, "/browser" as RelativePathString)
					}
					mode="contained">
					{loading ? "Signing In..." : "Sign In"}
				</Button>
			</View>
		</View>
	);
}
