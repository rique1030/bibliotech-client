import { Image, StyleSheet } from "react-native";
import { View } from "react-native";
import CustomHeader from "@/components/default/header/customheader";
import React, { useEffect } from "react";
import { Divider, useTheme, Text, Icon } from "react-native-paper";
import { useQuery } from "react-query";
import useRequest from "@/api/request";
import CONFIG from "@/config";
import toLetterCase from "@/helper/toLetterCase";
import { convertProfile } from "@/helper/imageUrl";
import { useRouter } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
const image = require("@/assets/images/default/user_photo.svg");

export default function Index() {
	const theme = useTheme();
	const { user } = useAuth();

	return (
		<View style={{ flex: 1 }}>
			<CustomHeader />
			<View style={styles.root}>
				<ProfilePicture picture={user?.profile_pic} />
				<View id="profile-info" style={styles.profileInfo}>
					<View style={styles.nameContainer}>
						<Text
							variant="headlineLarge"
							style={{
								fontWeight: "bold",
							}}>
							{`${
								user?.first_name ? toLetterCase(user.first_name) : "Unknown"
							} ${user?.last_name ? toLetterCase(user.last_name) : "User"}`}
						</Text>
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
						<BorrowPanel books={user?.borrowed_books || []} />
					</View>
				</View>
			</View>
		</View>
	);
}

const BorrowPanel = ({ books }: { books: string[] }) => {
	const theme = useTheme();
	return (
		<>
			<Text
				variant="bodyLarge"
				style={{ fontWeight: "bold", color: theme.colors.primary }}>
				BORROWED BOOKS
			</Text>
			{books.length === 0 ? (
				<Text variant="bodyMedium" style={{ color: "gray" }}>
					No book borrowed
				</Text>
			) : (
				<View
					style={[
						styles.booksContainer,
						{ borderColor: theme.colors.outlineVariant },
					]}>
					{books.map((book, index) => (
						<BookComponent key={index} bookTitle={book} />
					))}
				</View>
			)}
		</>
	);
};

const BookComponent = ({ bookTitle }: { bookTitle: any }) => {
	const theme = useTheme();
	return (
		<View
			style={[
				styles.book,
				{
					borderColor: theme.colors.outlineVariant,
					backgroundColor: theme.colors.background,
				},
			]}>
			<Image
				style={{ width: "70%", height: "70%", borderRadius: 10 }}
				source={require("@/assets/images/default/book_cover.png")}
			/>
			<Text variant="labelLarge">{bookTitle}</Text>
		</View>
	);
};

const ProfilePicture = ({ picture }: { picture: string }) => {
	const theme = useTheme();
	return (
		<View style={styles.imageContainer}>
			<View
				style={[
					styles.coverImage,
					{
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#5b40e4",
					},
				]}>
				<Image
					style={{ width: 100, height: 100 }}
					source={require("@/assets/images/default/user_photo.png")}
				/>
			</View>
			<Image
				style={[
					styles.profilePicture,
					{ borderColor: theme.colors.background },
				]}
				source={
					picture
						? { uri: convertProfile(picture) }
						: require("@/assets/images/default/user_photo.png")
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	root: {
		height: "100%",
		overflowY: "scroll",
	},

	imageContainer: {
		width: "100%",
		height: 265,
		position: "relative",
	},

	profilePicture: {
		width: 150,
		height: 150,
		borderRadius: 100,
		position: "absolute",
		borderWidth: 5,
		bottom: 0,
		left: 10,
	},
	coverImage: {
		width: "100%",
		height: 200,
	},

	profileInfo: {
		width: "100%",
		minHeight: 500,
		height: "auto",
		gap: 10,
	},
	nameContainer: {
		display: "flex",
		paddingHorizontal: 20,
		paddingVertical: 20,
		gap: 5,
	},
	booksContainer: {
		display: "flex",
		flexDirection: "row",
		overflowX: "auto",
		width: "100%",
		boxSizing: "border-box",
		backgroundColor: "rgba(0, 0, 0, 0.1)",
		padding: 10,
		borderRadius: 10,
		gap: 10,
	},
	book: {
		height: 150,
		width: 120,
		borderRadius: 5,
		borderWidth: 1,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		gap: 10,
	},
});
