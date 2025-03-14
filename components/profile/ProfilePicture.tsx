import { convertProfile } from "@/helper/imageUrl";
import { useEffect, useState } from "react";
import { View, StyleSheet, Image, ImageBackground } from "react-native";
import { useTheme } from "react-native-paper";

const default_image = require("@/assets/images/default/user_photo.png")

export default function ProfilePicture({ picture }: { picture: string }) {
   const theme = useTheme();
   const time = new Date().getTime().toString();
   const [ProfilePicture, setProfilePicture] = useState<string>("");
   const styles = StyleSheet.create({
      imageContainer: {
         width: "100%",
         height: 265,
         position: "relative",         
      },
      profilePicture: {
         borderColor: theme.colors.background, 
         borderWidth: 1,
         borderRadius: 100,
         overflow: "hidden",
         width: 150,
         height: 150,
         position: "absolute",
         outline: "none",
         bottom: 0,
         left: 10,
      },
      coverImage: {
         width: "100%",
         height: 200,
         alignItems: "center",
         justifyContent: "center",
         backgroundColor: "#5b40e4",
      },
   });

   useEffect(() => {
      convertProfile(picture).then((res) => setProfilePicture(res));
   },[])
   return (
      <View style={styles.imageContainer}>
         <View style={styles.coverImage}>
            <Image style={{ width: 100, height: 100 }} source={default_image} />
         </View>
         <ImageBackground source={default_image} style={styles.profilePicture}>
            <Image
               style={{ width: 150, height: 150 }}
               source={
                  picture === "" ||
                  picture === "default"
                     ? undefined
                     // require("@/assets/images/default/user_photo.png")
                     : { uri: `${ProfilePicture}?timestamp=${time}` }
               }
            />
         </ImageBackground>
      </View>
   );
};
