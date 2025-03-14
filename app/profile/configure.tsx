import ImageButton from "@/components/default/buttons/ImageButton";
import PasswordField from "@/components/default/textfield/password";
import isCooldownDone from "@/helper/isCooldownDone";
import CustomHeader from "@/components/default/header/customheader";
import NamedBorderedContainer from "@/components/default/containers/NamedBorderdContainer";
import useRequest, { getURL } from "@/api/request";
import { fetchImageAsBase64 } from "@/helper/fetchImageAsBase64";
import { pickImage } from "@/helper/imagePicker";
import { convertProfile } from "@/helper/imageUrl";
import { useRouter } from "expo-router/build/hooks";
import React, { useEffect, useState } from "react";
import {
	View,
	TextInput as NativeInput,
	ScrollView,
	TouchableOpacity,
	Alert,
} from "react-native";
import { useTheme, Text, TextInput, Button } from "react-native-paper";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation } from "react-query";
import { verifyEmail, verifyPassword } from "@/helper/verify";
import { RelativePathString } from "expo-router";

async function updateAccount(account: any) {
	return await useRequest({
		url: (await getURL()).API.USERS.UPDATE,
		method: "POST",
		payload: [account],
	});
}

export default function Configure() {
	const router = useRouter();
	const { user, login } = useAuth();
	const theme = useTheme();

	const [profileBlob, setProfileBlob] = useState<any>(null);
	const [userData, setUserData] = useState(user);
	const [RepeatPass, setRepeatPass] = useState(undefined);
	const [oldPassword, setOldPassword] = useState(undefined);

	const { mutate } = useMutation(updateAccount, {
		onSuccess: (data: any) => {
			if (data?.success) {
				const pass = userData.password || user.password;
				const email = userData.email || user.email;
				login(email, pass, "/profile" as RelativePathString).then(() => {
					alert("Account updated successfully");
				});
			} else {
				if (data?.message?.toLowerCase().includes("email")) {
					alert("Email already exists");
					return;
				}
				alert("An error occurred while updating your account");
			}
		},
		onError: (error) => {
			console.error(error);
		},
	});

	const [available] = useState({
		name: isCooldownDone(20, user?.name_updated),
		email: isCooldownDone(20, user?.email_updated),
		password: isCooldownDone(20, user?.password_updated),
	});

	const verifySubmission = () => {
		if (userData.password !== RepeatPass) {
			alert("Passwords do not match");
			return false;
		}
		if (
			!userData.first_name &&
			!userData.last_name &&
			!userData.email &&
			!userData.password &&
			!userData.profile_pic_buffer
		) {
			alert("No fields have been updated");
			return false;
		}
		if (!verifyEmail(userData.email)) {
			alert("Invalid email address");
			return false;
		}
		if (!verifyPassword(userData.password)) {
			alert("Password must contain at least 8 characters.");
			return false;
		}
		if (oldPassword !== user.password && userData.password) {
			alert("Old password is incorrect");
			return false;
		}
		return true;
	};

	const handleSubmit = () => {
		if (verifySubmission()) {
			mutate(userData);
			router.back();
		}
	};

	const pickImageAsync = async () => {
		const image = await pickImage();
		if (image) {
			setProfileBlob(image.uri);
			setUserData((prevData: any) => ({
				...prevData,
				profile_pic_buffer: image.base64,
			}));
		}
	};

	const handleInputChange = (key: string, value: string) => {
		setUserData((prevData: any) => ({
			...prevData,
			[key]: value,
		}));
	};

	useEffect(() => {
		setUserData({
			id: user?.id,
			first_name: undefined,
			last_name: undefined,
			email: undefined,
			password: undefined,
		});

		const fetchProfileBlob = async () => {
			if (user?.profile_pic) {
				const image = await convertProfile(user.profile_pic);
				await fetchImageAsBase64(image);
			}
		};
		fetchProfileBlob();
	}, [user]);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<CustomHeader back onClick={router.back} />
			<ScrollView>
				<View style={{ padding: 20, gap: 20 }}>
					<View>
						<Text
							style={{
								color: theme.colors.primary,
								fontSize: 20,
								marginBottom: 20,
							}}>
							Edit Profile
						</Text>
						<Text
							style={{
								color: theme.colors.onBackground,
								fontSize: 16,
								marginBottom: 5,
							}}>
							Edit your profile information
						</Text>
						<Text
							style={{
								color: theme.colors.outline,
								fontSize: 14,
								marginBottom: 20,
							}}>
							You can't edit fields that have been updated within the last 20
							days.
						</Text>
					</View>
					<NamedBorderedContainer label="Profile">
						<ImageButton onPress={pickImageAsync} profileBlob={profileBlob} />
					</NamedBorderedContainer>
					<NamedBorderedContainer label="Name">
						<ProfileTextArea
							label="First Name"
							editable={available.name}
							value={userData?.first_name}
							onChange={(text: string) => handleInputChange("first_name", text)}
						/>
						<ProfileTextArea
							label="Last Name"
							editable={available.name}
							value={userData?.last_name}
							onChange={(text: string) => handleInputChange("last_name", text)}
						/>
					</NamedBorderedContainer>
					<NamedBorderedContainer label="Account">
						<ProfileTextArea
							editable={available.email}
							label="Email"
							value={userData?.email}
							onChange={(text: string) => handleInputChange("email", text)}
						/>
					</NamedBorderedContainer>
					<NamedBorderedContainer label="Security">
						<PasswordField
							editable={available.password}
							onChangeText={(text: any) => setOldPassword(text)}
							label="Old Password"
							mode="outlined"
							dense
							style={{ marginBottom: 10 }}
						/>
						<PasswordField
							editable={available.password}
							onChangeText={(text: any) => handleInputChange("password", text)}
							label="New Password"
							mode="outlined"
							dense
							style={{ marginBottom: 10 }}
						/>
						{userData.password && (
							<PasswordField
								onChangeText={(text: any) => setRepeatPass(text)}
								label="Retype New Password"
								mode="outlined"
								dense
								style={{ marginBottom: 10 }}
							/>
						)}
					</NamedBorderedContainer>
					<TouchableOpacity onPress={handleSubmit}>
						<Button mode="contained" style={{ marginTop: 20 }}>
							Save Changes
						</Button>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
	);
}

interface ProfileTextAreaProps {
	value: string;
	onChange: any;
	label: string;
	editable?: boolean;
}
function ProfileTextArea({
	value = "",
	onChange,
	label = "",
	editable = true,
}: ProfileTextAreaProps) {
	const theme = useTheme();
	return (
		<TextInput
			defaultValue={value}
			onChangeText={onChange}
			editable={editable}
			contentStyle={{
				color: editable ? theme.colors.onBackground : theme.colors.outline,
			}}
			render={(props) => <NativeInput {...props} />}
			label={label}
			mode="outlined"
			dense
			style={{ marginBottom: 10 }}
		/>
	);
}
