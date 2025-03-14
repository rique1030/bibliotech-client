import { useState } from "react";
import { TextInput, useTheme } from "react-native-paper";
import { TextInput as NativeInput } from "react-native";

interface PasswordFieldFunction {
	editable: boolean;
	style: any;
	onChangeText: any;
	label: string;
}

export default function PasswordField({
	editable = true,
	style = {},
	onChangeText,
	label,
	...props
}: any) {
	const theme = useTheme();
	const [visible, setVisible] = useState(false);
	const toggleVisibility = () => {
		if (!editable) return;
		setVisible(!visible);
	};
	return (
		<TextInput
			editable={editable}
			disabled={!editable}
			onChangeText={onChangeText}
			contentStyle={{
				color: editable ? theme.colors.onBackground : theme.colors.outline,
			}}
			style={{ marginBottom: 10 }}
			label={label}
			mode="outlined"
			{...props}
			secureTextEntry={!visible}
			render={(props) => <NativeInput {...props} />}
			right={
				<TextInput.Icon
					disabled={!editable}
					icon={visible && editable ? "eye-off" : "eye"}
					onPress={toggleVisibility}
				/>
			}
		/>
	);
}
