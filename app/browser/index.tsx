import useRequest from "@/api/request";
import CustomHeader from "@/components/default/header/customheader";
import CONFIG from "@/config";
import { GlobalToast, useGlobalToast } from "@/hooks/useToast";
import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
	useTheme,
	Text,
	IconButton,
	Button,
	Icon,
	ActivityIndicator,
} from "react-native-paper";
import { useQuery } from "react-query";
const BookCover = require("@/assets/images/default/book_cover.png");

const PER_PAGE = 10;

async function searchBooks(bookPayload: any) {
	const payload = {
		url: CONFIG.URL.CATALOG.GET_PAGED_BOOKS,
		method: "POST" as const,
		payload: bookPayload,
	};
	return await useRequest(payload);
}

export default function Index() {
	const theme = useTheme();
	const { showToast } = useGlobalToast();
	const [searchTerm, setSearchTerm] = useState("");
	const [filterTerm, setFilterTerm] = useState("title");
	const [order_direction, setOrderDirection] = useState("asc");
	const [books, setBooks] = useState([]);
	const [page, setPage] = useState(0);
	const [totalItems, setTotalItems] = useState(0);
	const [warned, setWarned] = useState(false);

	const payload = {
		page: page,
		per_page: PER_PAGE,
		filters: searchTerm ? { [filterTerm]: searchTerm } : undefined,
		order_by: filterTerm,
		order_direction: order_direction,
	};

	const {
		data,
		refetch,
		isLoading: loading,
	} = useQuery({
		queryKey: ["books", payload],
		queryFn: () => {
			return searchBooks(payload);
		},
		cacheTime: 0,
		retry: 2,
		staleTime: 0,
	});

	useEffect(() => {
		refetch();
	}, []);

	const handlePageLeft = () => {
		if (page > 0) setPage(page - 1);
	};

	const handlePageRight = () => {
		console.log(Math.ceil(totalItems / PER_PAGE));
		if (page < Math.ceil(totalItems / PER_PAGE) - 1) setPage(page + 1);
	};

	const getVisiblePages = () => {
		const pages: number[] = [];

		const totalPages = Math.ceil(totalItems / PER_PAGE);
		const maxVisiblePages = 4;
		let startPage = Math.max(0, page - 2);
		let endPage = Math.min(totalPages, page + 2);

		if (page < 2) {
			endPage = Math.min(totalPages, maxVisiblePages);
		} else if (page > totalPages - 2) {
			startPage = Math.max(0, totalPages - maxVisiblePages);
		}

		for (let i = startPage; i < endPage; i++) {
			pages.push(i);
		}

		return pages;
	};

	useEffect(() => {
		try {
			if (data?.success) {
				setBooks(data?.data?.items || []);
				setTotalItems(data.data.total_count);
				console.log(data.data);
			} else {
				console.log(data?.error);
				if (warned) return;
				switch (data?.error) {
					case "ERR_NETWORK":
						showToast(
							"Unable to connect to the server. Please check your internet connection or try again later.",
							"error",
							5000
						);
						break;
				}
				setWarned(true);
			}
		} catch (error) {
			showToast(
				"Server is currently offline. Please try again later.",
				"error"
			);
			setBooks([]);
			setTotalItems(0);
			setPage(0);
		}
	}, [data]);

	useEffect(() => {
		setPage(0);
	}, [searchTerm, filterTerm]);

	return (
		<View style={{ flex: 1 }}>
			<CustomHeader
				search={{ searchTerm, setSearchTerm }}
				filter={{ filterTerm, setFilterTerm }}
				order={{ order_direction, setOrderDirection }}
			/>
			<ScrollView
				style={{
					backgroundColor: "rgba(0,0,0,0.1)",
					flex: 1,
				}}>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						gap: 10,
						padding: 10,
					}}>
					{(loading || books.length === 0) && (
						<View style={{ flex: 1, display: "flex", alignItems: "center" }}>
							<ActivityIndicator color={theme.colors.primary} size="large" />
						</View>
					)}
					{(!loading || books.length === 0) && (
						<View
							style={{ flex: 1, display: "flex", alignItems: "center" }}></View>
					)}
					{(!loading || books.length > 0) &&
						books.map((book: any) => (
							<BookComponent key={book.id} book={book} />
						))}
				</View>
			</ScrollView>
			<View
				style={{
					height: 60,
					width: "100%",
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<IconButton
					icon={() => (
						<Icon
							color={theme.colors.onSurface}
							source="chevron-left"
							size={30}
						/>
					)}
					size={30}
					onPress={handlePageLeft}
				/>
				<View style={{ display: "flex", flexDirection: "row" }}>
					{getVisiblePages().map((newpage) => (
						<Button
							key={newpage}
							mode="text"
							onPress={() => setPage(newpage)}
							labelStyle={{
								fontSize: 20,
								width: 20,
								fontWeight: "bold",
								color:
									page === newpage
										? theme.colors.primary
										: theme.colors.onSurface,
							}}
							style={{
								width: 40,
							}}>
							{newpage + 1}
						</Button>
					))}
				</View>
				<IconButton
					icon={() => (
						<Icon
							color={theme.colors.onSurface}
							source="chevron-right"
							size={30}
						/>
					)}
					size={30}
					onPress={handlePageRight}
				/>
			</View>
		</View>
	);
}

function getColor(status: string) {
	switch (status.toLowerCase()) {
		case "available":
			return "#4caf50";
		case "borrowed":
			return "#ff9800";
		case "lost":
			return "#f44336";
		default:
			return "#2196f3";
	}
}

const BookComponent = ({ book }: { book: any }) => {
	const router = useRouter();
	const handleClick = () => {
		router.push(
			`/book_profile?${new URLSearchParams({
				id: book?.id || "",
			}).toString()}` as any
		);
	};

	const theme = useTheme();
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			style={{ padding: 0, width: "100%", borderRadius: 5, margin: 0 }}
			onPress={handleClick}>
			<View
				style={[
					styles.bookComponent,
					{
						borderColor: theme.colors.outlineVariant,
						backgroundColor: theme.colors.background,
					},
				]}>
				<Image source={BookCover} style={styles.bookComponentImage} />
				<View
					style={{
						flex: 1,
						display: "flex",
						justifyContent: "center",
					}}>
					<Text variant="titleMedium">{book.title}</Text>
					<Text variant="labelLarge" style={{ opacity: 0.7 }}>
						{book.author}
					</Text>
					<Text variant="labelLarge" style={{ opacity: 0.7 }}>
						{`${book.copies} COPIES`}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	bookComponent: {
		height: 110,
		width: "100%",
		borderWidth: 1,
		display: "flex",
		padding: 10,
		borderRadius: 5,
		gap: 10,
		flexDirection: "row",
	},
	bookComponentImage: {
		width: 60,
		height: 90,
		borderRadius: 2,
	},
});
