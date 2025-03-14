import { TouchableOpacity, ImageBackground,  View } from "react-native";
import { useTheme, Icon, Button } from "react-native-paper";
const image = require("@/assets/images/default/user_photo.svg");

export default function ImageButton({ profileBlob, onPress }: { profileBlob: string; onPress?: any }) {
	const theme = useTheme();
	return (
		<TouchableOpacity onPress={onPress}>
			<ImageBackground
				source={profileBlob ? { uri: profileBlob } : image}
				style={{ width: 200, height: 200, borderRadius: 100, alignSelf: "center", }}
				imageStyle={{ borderRadius: 5, borderWidth: 1, borderColor: theme.colors.primary }}
				>	
					<Button mode="outlined" style={{
						marginBottom: 10,
						borderColor: theme.colors.primary,
						width: 200,
						height: 200,
						alignSelf: "center",
						borderRadius: 5,
					}}>
						<View style={{ alignItems: "center", justifyContent: "center", height: "100%" }}>
						 <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.primary, padding: 10, borderRadius: 50 }}>
						 <Icon source="pencil"  size={30} color={theme.colors.background}/>
						 </View>
						</View>
					</Button>
			</ImageBackground>
		</TouchableOpacity>
	)		
}