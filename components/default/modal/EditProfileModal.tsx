import { convertProfile } from "@/helper/imageUrl";
import { useEffect, useState } from "react";
import { View, StyleSheet, TextInput as NativeInput } from "react-native";
import { Modal, useTheme, Portal, Button, TextInput, Text } from "react-native-paper";
import { pickImage } from "@/helper/imagePicker";
import { fetchImageAsBase64 } from "@/helper/fetchImageAsBase64";
import ImageButton from "../buttons/ImageButton";
import PasswordField from "../textfield/password";
import isCooldownDone from "@/helper/isCooldownDone";

interface EditProfileModalProps {
	visible: boolean;
	setVisible: any;
	user?: any;
}

export default function EditProfileModal({
	visible,
	setVisible,
	user
}: EditProfileModalProps) {
	const theme = useTheme();
	const styles = StyleSheet.create({
		modal: {
			backgroundColor: theme.colors.background,
			padding: 20,
			borderRadius: 10,
			width: "90%",
			alignSelf: "center",
		},
	});

	const [profileBlob, setProfileBlob] = useState<any>(null);
	const [userData, setUserData] = useState(user);
	const [firstName, setFirstName] = useState(user?.first_name);
	const [available, setavailable] = useState({
		name: isCooldownDone(50, user?.name_updated),
		email: isCooldownDone(50, user?.email_updated),
		password: isCooldownDone(50, user?.password_updated)
	});
	const pickImageAsync = async () => {
		const image = await pickImage()
		if (image) setProfileBlob(image.uri);
	}

	const handleInputChange = (key: string, value: string) => {
		setUserData((prevData: any) => ({
			...prevData,
			[key]: value
		}))
	}

	useEffect(() => {
		setUserData(user)
		const fetchProfileBlob = async () => {
			if (user?.profile_pic) {
				const image = await convertProfile(user.profile_pic)
				await fetchImageAsBase64(image);
			}
		}
		fetchProfileBlob();
	}, [visible])

	return (
		<Portal>
			<Modal visible={visible} onDismiss={() => setVisible(false)}>
				<View style={styles.modal}>
					<ImageButton onPress={pickImageAsync} profileBlob={profileBlob} />
					<View style={{ paddingHorizontal: 10, paddingVertical: 20 }}> 
					{ !available.name || !available.email || !available.password ? 
						(<>
							<Text style={{ color: theme.colors.error,  marginBottom: 10 }}> 
								{"The following fields were updated in the past 20 days:"}
							</Text>
							{ !available.name ? <Text style={{ color: theme.colors.error,  marginBottom: 10 }}> 
								{"- Name"}
							</Text> : null }
							{ !available.email ? <Text style={{ color: theme.colors.error,  marginBottom: 10 }}> 
								{"- Email"}
							</Text> : null }
							{ !available.password ? <Text style={{ color: theme.colors.error,  marginBottom: 10 }}> 
								{"- Password"}
							</Text> : null }
						</>
												)
						 : null
					}
					</View>
						

					<ProfileTextArea 
						label="First Name" 
						editable={isCooldownDone(20, user?.name_updated)} 
						value={userData?.first_name} 
						onChange={(text : string) => handleInputChange("first_name", text) } 
					/>
					<ProfileTextArea 
						label="Last Name" 
						editable={isCooldownDone(20, user?.name_updated)} 
						value={userData?.last_name} 
						onChange={(text : string) => handleInputChange("last_name", text) } 
					/>
					<ProfileTextArea 
						editable={isCooldownDone(20, user?.email_updated)} 
						label="Email" 
						value={userData?.email} 
						onChange={(text : string) => handleInputChange("email", text) } 
					/>
					<PasswordField
						editable={isCooldownDone(20, user?.password_updated)} 
						onChangeText={(text: any) => setUserData({...userData, password: text})}
						label="New Password"
						mode="outlined"
						dense
						style={{ marginBottom: 10 }}
					/>
					<PasswordField
						editable={isCooldownDone(20, user?.password_updated)} 
						onChangeText={(text: any) => setUserData({...userData, password: text})}
						label="Retype New Password"
						mode="outlined"
						dense
						style={{ marginBottom: 10 }}
					/>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}>
						<Button
							mode="outlined"
							onPress={() => setVisible(false)}
							style={{
								marginTop: 10,
								minWidth: 100,
								borderColor: theme.colors.primary,
							}}>
							Cancel
						</Button>
						<Button
							mode="contained"
							onPress={() => setVisible(false)}
							style={{ marginTop: 10, minWidth: 100 }}>
							Save
						</Button>
					</View>
				</View>
			</Modal>
		</Portal>
	);
}

interface ProfileTextAreaProps { value: string; onChange: any; label: string; editable?: boolean}
function ProfileTextArea({ value = "", onChange, label="", editable = true }: ProfileTextAreaProps ) {
	const theme = useTheme();
	return (
		<TextInput
			defaultValue={value}
			onChangeText={onChange}
			editable={editable}
			contentStyle={{ color: editable ? theme.colors.onBackground : theme.colors.outline }}
			render={ props => 
				(<NativeInput {...props}/>)
			}
			label={label}
			mode="outlined"
			dense
			style={{ marginBottom: 10 }}
		/>
	)
}