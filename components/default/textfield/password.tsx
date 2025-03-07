import { useState } from "react";
import { TextInput } from "react-native-paper";

export default function PasswordField(props: any) {
	const [visible, setVisible] = useState(false);
	const toggleVisibility = () => setVisible(!visible);
	return (
		<TextInput
			{...props}
			secureTextEntry={!visible}
			right={
				<TextInput.Icon
					icon={visible ? "eye-off" : "eye"}
					onPress={toggleVisibility}
				/>
			}
		/>
	);
}
