import { TouchableOpacity, View, Image } from "react-native";
import { Icon, Text, useTheme } from "react-native-paper";

export default function ClientButton({
	client,
	onClick,
	keyID,
}: {
	client: any;
	onClick: any;
	keyID: any;
}) {
	const theme = useTheme();
	const handleClick = () => {
		if (client?.busy) {
			alert("Client is busy");
			return;
		}
		onClick(keyID);
	};
	return (
		<TouchableOpacity onPress={handleClick}>
			<View
				style={{
					width: "100%",
					borderWidth: 1,
					borderColor: theme.colors.outlineVariant,
					height: 100,
					borderRadius: 10,
					padding: 10,
					flexDirection: "row",
					gap: 20,
				}}>
				<Image
					source={
						client?.picture
							? { uri: client?.picture }
							: require("@/assets/images/default/user_photo.png")
					}
					style={{
						height: 75,
						width: 75,
						borderRadius: 5,
						resizeMode: "contain",
					}}
				/>
				<View>
					<Text
						variant="bodyLarge"
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{ fontWeight: "bold", width: 200 }}>
						{`${
							client?.first_name.toLowerCase().charAt(0).toUpperCase() +
							client?.first_name.toLowerCase().slice(1)
						}${
							client?.last_name.toLowerCase().charAt(0).toUpperCase() +
							client?.last_name.toLowerCase().slice(1)
						}`}
					</Text>
					<Text
						variant="bodyLarge"
						numberOfLines={1}
						ellipsizeMode="tail"
						style={{ opacity: 0.5, width: 200 }}>
						{`${keyID.toUpperCase()}`}
					</Text>
					<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
						<Icon
							size={20}
							source={"access-point"}
							color={client?.busy ? "#f44336" : "#4caf50"}
						/>
						<Text
							variant="bodyLarge"
							numberOfLines={1}
							ellipsizeMode="tail"
							style={{ opacity: 0.5, width: 200 }}>
							{client?.busy ? "BUSY" : "AVAILABLE"}
						</Text>
					</View>
				</View>
			</View>
		</TouchableOpacity>
	);
}
