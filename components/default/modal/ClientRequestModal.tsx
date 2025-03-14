import { View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { Modal, Portal, Text, ActivityIndicator } from "react-native-paper";

interface ClientRequestModalProps {
	modalVisible: boolean;
	setModalVisible: any;
}
export default function ClientRequestModal({
	modalVisible,
	setModalVisible,
}: ClientRequestModalProps) {
	const theme = useTheme();
	const styles = StyleSheet.create({
		modalContainer: {
			justifyContent: "center",
			alignItems: "center",
		},
		modalRect: {
			backgroundColor: theme.colors.background,
			width: 300,
			height: 200,
			alignItems: "center",
			justifyContent: "center",
			gap: 20,
			borderRadius: 10,
			borderColor: theme.colors.outlineVariant,
			borderWidth: 1,
		},
	});
	return (
		<Portal>
			<Modal
				onDismiss={() => setModalVisible(false)}
				dismissable
				dismissableBackButton
				visible={modalVisible}
				contentContainerStyle={styles.modalContainer}>
				<View style={styles.modalRect}>
					<Text variant="titleLarge">Borrowing...</Text>
					<ActivityIndicator animating size={"large"} />
				</View>
			</Modal>
		</Portal>
	);
}
