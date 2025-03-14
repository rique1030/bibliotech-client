import useRequest, { getURL } from "@/api/request";
import CustomHeader from "@/components/default/header/customheader";
import { convertCover } from "@/helper/imageUrl";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { useQuery } from "react-query";

async function fetchBookByID(bookPayload: any) {
	const payload = {
		url: (await getURL()).API.BOOKS.GET_BY_ID,
		method: "POST" as const,
		payload: bookPayload,
	};
	return await useRequest(payload);
}

async function fetchCategoryByID(categoryPayload: any) {
	const payload = {
		url: (await getURL()).API.CATEGORIES.GET_BY_ID,
		method: "POST" as const,
		payload: categoryPayload,
	};
	return await useRequest(payload);
}

async function fetchCopyByCatalogID(copyPayload: any) {
	const payload = {
		url: (await getURL()).API.COPIES.GET_BY_CATALOG,
		method: "POST" as const,
		payload: copyPayload,
	};
	return await useRequest(payload);
}

export default function Index() {
	const theme = useTheme();
	const params = useSearchParams();
	const router = useRouter();
	const id = params.get("id") as string;
	const [book, setBook] = useState<any>({});
	const [categoryIDs, setCategoryIDs] = useState<string[]>([]);
	const [categories, setCategories] = useState<any>([]);
	const [copies, setCopies] = useState<any>([]);
	const [bookCover, setBookCover] = useState<string>("");
	const { data: book_data, refetch: refetch_book } = useQuery({
		queryKey: ["books", [id]],
		queryFn: () => {
			return fetchBookByID([id]);
		},
		retry: 2,
		cacheTime: 0,
		staleTime: 0,
	});

	const { data: category_data, refetch: refetch_category } = useQuery({
		queryKey: ["categories", categoryIDs],
		queryFn: () => {
			return fetchCategoryByID(categoryIDs);
		},
		retry: 2,
		cacheTime: 0,
		staleTime: 0,
	});

	const { data: copy_data, refetch: refetch_copy } = useQuery({
		queryKey: ["copies", [book?.id]],
		queryFn: () => {
			return fetchCopyByCatalogID([book?.id]);
		},
		retry: 2,
		cacheTime: 0,
		staleTime: 0,
	});

	useEffect(() => {
		refetch_book();
		convertCover(book?.cover_image).then((res) => setBookCover(res));
	}, []);

	useEffect(() => {
		if (book_data?.data) {
			setBook(book_data?.data[0]);
			setCategoryIDs(book_data?.data[0]?.book_category_ids);
		}
	}, [book_data]);

	useEffect(() => {
		if (category_data?.data) setCategories(category_data?.data);
	}, [category_data]);

	useEffect(() => {
		if (copy_data?.data) setCopies(copy_data?.data);
	}, [copy_data]);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<CustomHeader back onClick={() => router.back()} />
			<ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
				<View
					style={{ alignItems: "center", paddingBottom: 80, height: "100%" }}>
					<Image
						source={
							book?.cover_image === "default" ||
							book?.cover_image === "" ||
							!book?.cover_image
								? require("@/assets/images/default/book_cover.png")
								: { uri: bookCover }
						}
						style={{
							width: 150,
							height: 220,
							borderRadius: 10,
							marginVertical: 20,
						}}
					/>
					<View style={{ width: "100%", paddingHorizontal: 20 }}>
						<Text
							variant="headlineMedium"
							style={{ textAlign: "center", fontWeight: "bold" }}>
							{book?.title || "Title"}
						</Text>
						<Text
							variant="titleMedium"
							style={{ textAlign: "center", paddingVertical: 10 }}>
							{book?.author || "Author"}
						</Text>
						<SecondaryDetails book={book} />
						<DescriptionPanel book={book} />
						<CategoryPanel categories={categories} />
						<CopyPanel copies={copies} />
					</View>
				</View>
			</ScrollView>
		</View>
	);
}

function CopyPanel({ copies }: { copies: any }) {
	const theme = useTheme();
	const getBackgroundColor = (type: string) => {
		switch (type) {
			case "available":
				return "#4caf50";
			case "borrowed":
				return "#ff9800";
			case "lost":
				return "#f44336";
		}
	};

	return (
		<>
			<Text
				variant="bodyLarge"
				style={{
					textTransform: "uppercase",
					color: theme.colors.primary,
				}}>
				Copies
			</Text>
			<View style={{ paddingVertical: 10, paddingLeft: 10, gap: 10 }}>
				{copies?.map((copy: any) => (
					<View
						key={copy?.id}
						style={{
							display: "flex",
							flexDirection: "row",
							gap: 10,
							alignItems: "center",
						}}>
						<Chip
							textStyle={{ color: "white" }}
							style={{
								backgroundColor: getBackgroundColor(copy?.status),
								borderRadius: 50,
							}}>
							{copy?.status?.toUpperCase()}
						</Chip>
						<Text variant="bodyMedium" style={{ opacity: 0.5 }}>
							{copy?.access_number}
						</Text>
					</View>
				))}
			</View>
		</>
	);
}

function SecondaryDetails({ book }: { book: any }) {
	const theme = useTheme();
	return (
		<>
			<Text
				variant="bodyLarge"
				style={{
					textTransform: "uppercase",
					color: theme.colors.primary,
				}}>
				Details
			</Text>
			<View style={{ paddingVertical: 10, paddingLeft: 10 }}>
				<Text variant="bodyMedium" style={{ opacity: 0.5 }}>
					{`Publisher: ${book?.publisher || "N/A"}`}
				</Text>
				<Text variant="bodyMedium" style={{ opacity: 0.5 }}>
					{`Call Number: ${book?.call_number || "N/A"}`}
				</Text>
			</View>
		</>
	);
}

function DescriptionPanel({ book }: { book: any }) {
	const theme = useTheme();
	return (
		<>
			<Text
				variant="bodyLarge"
				style={{
					textTransform: "uppercase",
					color: theme.colors.primary,
				}}>
				Description
			</Text>
			<View style={{ paddingVertical: 10, paddingLeft: 10 }}>
				<Text variant="bodyMedium" style={{ opacity: 0.5 }}>
					{book?.description || "No description"}
				</Text>
			</View>
		</>
	);
}

function CategoryPanel({ categories }: { categories: any }) {
	const theme = useTheme();
	return (
		<>
			<Text
				variant="bodyLarge"
				style={{
					textTransform: "uppercase",
					color: theme.colors.primary,
				}}>
				Categories
			</Text>
			<View
				style={{
					paddingVertical: 10,
					paddingLeft: 10,
					gap: 10,
					flexDirection: "row",
					flexWrap: "wrap",
				}}>
				{categories?.length === 0 && (
					<Text variant="bodyMedium" style={{ opacity: 0.5 }}>
						No categories
					</Text>
				)}
				{categories?.map((category: any) => (
					<Chip
						key={category?.id}
						mode="outlined"
						compact
						textStyle={{ color: theme.colors.primary }}
						style={{
							borderColor: theme.colors.primary,
							backgroundColor: theme.colors.background,
							borderRadius: 50,
						}}>{`${category?.name}`}</Chip>
				))}
			</View>
		</>
	);
}
