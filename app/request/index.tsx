import ClientButton from "@/components/default/buttons/ClientButton";
import CustomHeader from "@/components/default/header/customheader";
import ClientRequestModal from "@/components/default/modal/ClientRequestModal";
import useClientRequest from "@/hooks/useClientRequest";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { routeToScreen } from "expo-router/build/useScreens";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Icon, Text, useTheme } from "react-native-paper";

export default function Index() {
	const router = useRouter();
	const theme = useTheme();
	const param = useSearchParams();
	const type = param.get("type") as string;
	const book_id = param.get("book_id") as string;
	const { clients, modalVisible, setModalVisible, handleClientPress } =
		useClientRequest(type, book_id);

	const styles = StyleSheet.create({
		root: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		scrollContainer: {
			flex: 1,
			padding: 20,
			gap: 20,
		},
		emptyListContainer: {
			width: "100%",
			height: 400,
			justifyContent: "center",
			alignItems: "center",
		},
		emptyListLabel: {
			color: theme.colors.outlineVariant,
		},
	});

	const EmptyList = () => (
		<View style={styles.emptyListContainer}>
			<Text style={styles.emptyListLabel} variant="titleLarge">
				No Librarians are currently available
			</Text>
			<Icon
				color={theme.colors.outlineVariant}
				source="emoticon-sad-outline"
				size={100}
			/>
		</View>
	);

	return (
		<View style={styles.root}>
			<CustomHeader back onClick={() => router.back()} />
			<ClientRequestModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
			/>
			<ScrollView>
				<View style={styles.scrollContainer}>
					{clients.length === 0 && <EmptyList />}
					{clients.map(([clientId, client]: any) => (
						<ClientButton
							keyID={clientId}
							key={clientId}
							client={client}
							onClick={handleClientPress}
						/>
					))}
				</View>
			</ScrollView>
		</View>
	);
}
