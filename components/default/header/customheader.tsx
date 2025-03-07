import Alpha from "@/helper/alpha";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { View, Image, StyleSheet, TextInput } from "react-native";
import {
	Appbar,
	Icon,
	IconButton,
	Menu,
	Searchbar,
	Text,
	useTheme,
	Checkbox,
} from "react-native-paper";
const Logo = require("@/assets/images/default/Logo.png");

const filters = [
	{ name: "Title", value: "title" },
	{ name: "Author", value: "author" },
];

interface CustomHeaderProps {
	onClick?: () => void;
	back?: boolean;
	order?: any;
	search?: any;
	filter?: any;
}

export default function CustomHeader({
	onClick,
	back = false,
	order,
	search,
	filter,
}: CustomHeaderProps) {
	const theme = useTheme();
	const navigation = useNavigation();
	const [filterMenu, setFilterMenu] = useState(false);
	const { searchTerm, setSearchTerm } = search || {};
	const { setFilterTerm, filterTerm } = filter || {};
	const { order_direction, setOrderDirection } = order || {};

	const toggleDrawer = () => {
		navigation.dispatch(DrawerActions.toggleDrawer());
	};

	const handleChangeFilter = (value: string) => {
		setFilterMenu(false);
		if (!filter) return;
		setFilterTerm(value);
		if (!search) return;
		setSearchTerm("");
	};

	return (
		<Appbar
			style={[
				{
					backgroundColor: theme.colors.background,
					height: search ? 140 : 60,
					borderColor: theme.colors.outlineVariant,
				},
				styles.appbar,
			]}>
			<View style={styles.root}>
				<View style={styles.logoContainer}>
					<Image source={Logo} style={styles.image} />
					<Text variant="titleLarge">Bibliotech</Text>
				</View>
				<IconButton
					size={30}
					onPress={back ? onClick : toggleDrawer}
					icon={back ? "chevron-left" : "menu"}
				/>
			</View>
			{search && (
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						width: "100%",
						justifyContent: "space-between",
						alignItems: "center",
						paddingHorizontal: 20,
					}}>
					<Searchbar
						mode="bar"
						style={[
							styles.Searchbar,
							{ backgroundColor: Alpha(theme.colors.onSurface, 0.1) },
						]}
						iconColor="#5b40e4"
						// @ts-ignore
						clearIcon={false}
						inputStyle={[styles.inputText, { color: theme.colors.onSurface }]}
						value={searchTerm}
						onChangeText={setSearchTerm}
					/>
					<Menu
						visible={filterMenu}
						contentStyle={{ backgroundColor: theme.colors.background }}
						onDismiss={() => setFilterMenu(false)}
						anchor={
							<IconButton
								icon={() => <Icon source="filter" color="#5b40e4" size={25} />}
								onPress={() => setFilterMenu(!filterMenu)}
							/>
						}
						anchorPosition="bottom">
						{filters.map((filter) => (
							<Menu.Item
								style={{ backgroundColor: theme.colors.background }}
								key={filter.value}
								title={
									<Text
										variant="bodyLarge"
										style={{
											color:
												filter.name.toLowerCase() === filterTerm.toLowerCase()
													? "#5b40e4"
													: theme.colors.onSurface,
										}}>
										{filter.name}
									</Text>
								}
								onPress={() => handleChangeFilter(filter.value)}
							/>
						))}
						<Menu.Item
							style={{ padding: 0 }}
							onPress={() =>
								setOrderDirection((prev: string) =>
									prev === "asc" ? "desc" : "asc"
								)
							}
							title={
								<View
									style={{
										padding: 0,
										display: "flex",
										flexDirection: "row",
										justifyContent: "flex-start",
										paddingRight: 10,
										alignItems: "center",
									}}>
									<Checkbox
										status={order_direction === "asc" ? "checked" : "unchecked"}
									/>
									<Text variant="bodyLarge">Ascending</Text>
								</View>
							}></Menu.Item>
					</Menu>
				</View>
			)}
		</Appbar>
	);
}

const styles = StyleSheet.create({
	appbar: {
		display: "flex",
		flexDirection: "column",
		gap: 10,
		borderBottomWidth: 1,
	},
	root: {
		display: "flex",
		flexDirection: "row-reverse",
		justifyContent: "space-between",
		alignItems: "center",
		alignContent: "center",
		flexWrap: "wrap",
		width: "100%",
	},
	logoContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingHorizontal: 10,
	},
	image: {
		width: 35,
		height: 35,
		resizeMode: "contain",
	},
	Searchbar: {
		width: "80%",
		height: 40,
	},
	inputText: {
		minHeight: 40,
		height: 40,
	},
});
