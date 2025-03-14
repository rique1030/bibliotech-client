import * as ImagePicker from "expo-image-picker";

export async function pickImage() {
   const result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1,1],
      quality: 1,
      base64: true,
   });
   if (!result.canceled) {
      return result.assets[0];
   } else {
      return null;
   }
}