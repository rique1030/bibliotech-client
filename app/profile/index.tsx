import useRequest, { getURL } from "@/api/request";
import toLetterCase from "@/helper/toLetterCase";
import CustomHeader from "@/components/default/header/customheader";
import EditProfileModal from "@/components/default/modal/EditProfileModal";
import ProfilePicture from "@/components/profile/ProfilePicture";
import React, { useEffect } from "react";
import { useQuery } from "react-query";
import { useAuth } from "@/providers/AuthProvider";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Divider, useTheme, Text, Icon } from "react-native-paper";
import { BorrowPanel } from "@/components/profile/BorrowPanel";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";

async function getBorrowedBooks(userID: string) {
	return await useRequest({
		url: (await getURL()).API.USERS.GET_BORROWED,
		method: "POST",
		payload: [userID],
	});
}

export default function Index() {
	const theme = useTheme();

	const styles = StyleSheet.create({
		root: {
			height: "100%",
			overflowY: "scroll",
		},
		profileInfo: {
			width: "100%",
			height: "auto",
			gap: 10,
			paddingBottom: 30,
		},
		primaryContainer: {
			display: "flex",
			paddingHorizontal: 20,
			paddingVertical: 20,
			gap: 5,
		},
		nameContainer: {
			display: "flex",
			flexDirection: "row",
			gap: 10,
			alignItems: "center",
		},
	});

	const { user } = useAuth();
	const [books, setBooks] = React.useState<any[]>([]);
	const { data: fetched_books, refetch } = useQuery({
		queryKey: ["borrowed_books", user?.id],
		queryFn: () => getBorrowedBooks(user?.id),
		cacheTime: 0,
		retry: 2,
		staleTime: 0,
	});

	useEffect(() => {
		if (fetched_books?.success) {
			setBooks(fetched_books?.data);
		}
	}, [fetched_books]);

	useFocusEffect(
		React.useCallback(() => {
			refetch();
		}, [])
	);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<CustomHeader />
			<ScrollView>
				<View style={styles.root}>
					<ProfilePicture picture={user?.profile_pic} />
					<View id="profile-info" style={styles.profileInfo}>
						<View style={styles.primaryContainer}>
							<View style={styles.nameContainer}>
								<Text variant="headlineLarge" style={{ fontWeight: "bold" }}>
									{`${
										user?.first_name ? toLetterCase(user.first_name) : "Unknown"
									} ${user?.last_name ? toLetterCase(user.last_name) : "User"}`}
								</Text>
								<TouchableOpacity
									onPress={() =>
										router.push(`/profile/configure?user=${user}`)
									}>
									<Icon source={"pencil"} size={20} color={"gray"} />
								</TouchableOpacity>
							</View>
							<View
								style={{
									display: "flex",
									flexDirection: "row",
									alignItems: "center",
									gap: 10,
								}}>
								<Icon
									source={"check-decagram"}
									size={20}
									color={user?.is_verified ? theme.colors.primary : "gray"}
								/>
								<Text variant="labelLarge">
									{user?.is_verified ? "Verified" : "Not Verified"}
								</Text>
							</View>
						</View>
						<Divider />
						<View
							style={{
								paddingHorizontal: 20,
								gap: 10,
								boxSizing: "border-box",
							}}>
							<BorrowPanel books={books || []} />
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
