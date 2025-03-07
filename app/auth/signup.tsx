import PasswordField from "@/components/default/textfield/password";
import { verifyEmail, verifyID, verifyPassword } from "@/helper/verify";
import { useRouter } from "expo-router";
import { memo, useContext, useState } from "react";
import { View } from "react-native";
import {
	Button,
	HelperText,
	Text,
	TextInput,
	useTheme,
} from "react-native-paper";
import { GlobalToast, useGlobalToast } from "@/hooks/useToast";

function VerifyField(data: {
	fname: string;
	lname: string;
	id: string;
	email: string;
	password: string;
}) {
	if (!data.fname) throw new Error("First name is required");
	if (!data.lname) throw new Error("Last name is required");
	if (!data.id) throw new Error("ID number is required");
	if (!verifyID(data.id)) throw new Error("Invalid ID number");
	if (!data.email) throw new Error("Email is required");
	if (!verifyEmail(data.email)) throw new Error("Invalid email address");
	if (!data.password) throw new Error("Password is required");
	if (!(data.password.length >= 8))
		throw new Error("Password must be at least 8 characters");
	return true;
}

function SignUp() {
	const theme = useTheme();
	const router = useRouter();
	const { showToast } = useGlobalToast();

	const [signUpData, setSignUpData] = useState({
		fname: "",
		lname: "",
		id: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState("");

	const handleEdit = (key: string, value: string) => {
		setSignUpData({ ...signUpData, [key]: value });
		setError(false);
	};

	const handleSignUp = () => {
		try {
			VerifyField(signUpData);
			showToast("Signing up...", "info");
			router.replace("/auth/login");
			setTimeout(() => showToast("Sign up successful", "success"), 3000);
			// showToast("Sign up successful", "success");
		} catch (error: any) {
			setError(true);
			setErrorText(error.message as string);
		}
	};

	return (
		<View
			style={{
				width: "100%",
				height: "100%",
				paddingHorizontal: 40,
				justifyContent: "space-between",
				backgroundColor: theme.colors.background,
			}}>
			<View>
				<Text variant="headlineSmall">Welcome to Bibliotech</Text>
				<Text variant="labelLarge">Sign up to continue</Text>
			</View>
			<View style={{ gap: 10 }}>
				<TextInput
					label={"First Name"}
					mode="outlined"
					onChangeText={(value) => handleEdit("fname", value)}
				/>
				<TextInput
					label={"Last Name"}
					mode="outlined"
					onChangeText={(value) => handleEdit("lname", value)}
				/>
				<TextInput
					label={"ID Number"}
					mode="outlined"
					onChangeText={(value) => handleEdit("id", value)}
				/>
				<TextInput
					label={"Email"}
					mode="outlined"
					onChangeText={(value) => handleEdit("email", value)}
				/>
				<PasswordField
					label={"Password"}
					mode="outlined"
					onChangeText={(value: string) => handleEdit("password", value)}
				/>
				<HelperText type="error" visible={error}>
					{errorText}
				</HelperText>
			</View>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<Button mode="outlined" onPress={() => router.replace("/auth/login")}>
					Log In
				</Button>
				<Button mode="contained" onPress={handleSignUp}>
					Sign Up
				</Button>
			</View>
		</View>
	);
}

export default SignUp;
