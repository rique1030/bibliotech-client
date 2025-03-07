import { createContext, useContext, useState } from "react";
import { View } from "react-native";
import { Icon, Snackbar, Text } from "react-native-paper";

export default function useToast() {
	const [toast, setToast] = useState(false);
	const [text, setText] = useState("Have a nice day!");
	const [type, setType] = useState("info");
	const [duration, setDuration] = useState(3000);

	const showToast = (text: string, type: string, duration?: number) => {
		console.info(text);
		setText(text);
		setType(type);
		setToast(true);
		setDuration(duration || 3000);
	};

	return {
		toast,
		setToast,
		text,
		type,
		duration,
		showToast,
	};
}

export function Toast() {
	const { toast, text, type, setToast, duration } = useGlobalToast();
	const handleClose = () => {
		setToast(false);
	};
	const getIcon = () => {
		switch (type) {
			case "info":
				return "information-outline";
			case "success":
				return "check-circle-outline";
			case "error":
				return "alert-circle-outline";
		}
	};

	const getBackgroundColor = () => {
		switch (type) {
			case "info":
				return "#2196f3";
			case "success":
				return "#4caf50";
			case "warning":
				return "#ff9800";
			case "error":
				return "#f44336";
		}
	};

	return (
		<Snackbar
			wrapperStyle={styles.toastWrapper}
			style={[styles.toast, { backgroundColor: getBackgroundColor() }]}
			visible={toast}
			duration={duration}
			icon={"close"}
			onDismiss={() => handleClose()}
			onIconPress={() => handleClose()}>
			<View style={{ display: "flex", flexDirection: "row", gap: 8 }}>
				<Icon source={getIcon()} size={24} />
				<Text variant="bodyMedium">{type}</Text>
			</View>
			<Text variant="bodyLarge">{text}</Text>
		</Snackbar>
	);
}

const styles = {
	toastWrapper: {
		position: "absolute" as const,
		padding: 0,
		top: 0,
	},
	toast: {
		padding: 0,
		// position: "" as const,
	},
};

export interface GlobalToastInterface {
	toast: boolean;
	setToast: (toast: boolean) => void;
	text: string;
	type: "info" | "success" | "warning" | "error" | string;
	duration: number;
	showToast: (
		text: string,
		type: "info" | "success" | "warning" | "error" | string,
		duration?: number
	) => void;
}

export const GlobalToast = createContext<GlobalToastInterface>({
	toast: false,
	setToast: () => {},
	text: "",
	type: "info",
	duration: 3000,
	showToast: () => {},
});

export const useGlobalToast = () => useContext(GlobalToast);
