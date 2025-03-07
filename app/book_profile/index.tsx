import useRequest from "@/api/request";
import CONFIG from "@/config";
import { convertCover, convertProfile } from "@/helper/imageUrl";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { View, Image, ScrollView } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { useQuery } from "react-query";

async function fetchBookByID(bookPayload: any) {
	const payload = {
		url: CONFIG.URL.CATALOG.GET_BOOKS_BY_ID,
		method: "POST" as const,
		payload: bookPayload,
	};
	return await useRequest(payload);
}

async function fetchCategoryByID(categoryPayload: any) {
	const payload = {
		url: CONFIG.URL.CATEGORY.GET_CATEGORIES_BY_ID,
		method: "POST" as const,
		payload: categoryPayload,
	};
	return await useRequest(payload);
}

async function fetchCopyByCatalogID(copyPayload: any) {
	const payload = {
		url: CONFIG.URL.COPY.GET_COPIES_BY_CATALOG_ID,
		method: "POST" as const,
		payload: copyPayload,
	};
	return await useRequest(payload);
}

export default function Index() {
	const theme = useTheme();
	const params = useSearchParams();
	const id = params.get("id") as string;
	const [book, setBook] = useState<any>({});
	const [categoryIDs, setCategoryIDs] = useState<string[]>([]);
	const [categories, setCategories] = useState<any>([]);
	const [copies, setCopies] = useState<any>([]);

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
		console.log(copy_data);
		if (copy_data?.data) setCopies(copy_data?.data);
	}, [copy_data]);

	return (
		<ScrollView contentContainerStyle={{ paddingVertical: 20 }}>
			<View style={{ alignItems: "center", paddingBottom: 80, height: "100%" }}>
				<Image
					source={
						book?.cover_image === "default"
							? require("@/assets/images/default/book_cover.png")
							: { uri: convertCover(book?.cover_image) }
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
						{book?.title}
					</Text>
					<Text
						variant="titleMedium"
						style={{ textAlign: "center", paddingVertical: 10 }}>
						{book?.author}
					</Text>
					<SecondaryDetails book={book} />
					<DescriptionPanel book={book} />
					<CategoryPanel categories={categories} />
					<CopyPanel copies={copies} />
				</View>
			</View>
		</ScrollView>
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
					{`Publisher: ${book?.publisher}`}
				</Text>
				<Text variant="bodyMedium" style={{ opacity: 0.5 }}>
					{`Call Number: ${book?.call_number}`}
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
					{book?.description}
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
