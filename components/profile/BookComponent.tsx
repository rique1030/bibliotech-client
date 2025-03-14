import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useTheme, Text } from "react-native-paper";

export default function BookComponent({ bookTitle, book }: { bookTitle: any; book: any }) {
	const theme = useTheme();
	const router = useRouter();
	const [bookData, setBookData] = useState<any>({});
   
   const styles = StyleSheet.create({
      book: {
         height: 150,
         width: 120,
         borderRadius: 5,
         borderWidth: 1,
         display: "flex",
         justifyContent: "center",
         alignItems: "center",
         gap: 10,
         borderColor: theme.colors.outlineVariant,
         backgroundColor: theme.colors.background,
      },
   });
   

	useEffect(() => {
		if (book) {
			setBookData(book);
		}
	}, [book]);

	const handleClick = () => {
		router.push(
			`/book_profile?${new URLSearchParams({
				id: bookData.catalog_id,
			})}`
		);
	};

	return (
		<TouchableOpacity activeOpacity={0.8} onPress={handleClick}>
			<View
				style={styles.book}>
				<Image
					style={{ width: "70%", height: "70%", borderRadius: 10 }}
					source={require("@/assets/images/default/book_cover.png")}
				/>
				<Text variant="labelLarge">{bookTitle}</Text>
			</View>
		</TouchableOpacity>
	);
};