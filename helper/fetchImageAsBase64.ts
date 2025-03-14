import axios from "axios";

export async function fetchImageAsBase64(imageUrl: string): Promise<string | null> {
   if (!imageUrl) return null;
   try {
      const response = await axios.get(imageUrl, { responseType: 'blob' });
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onloadend = () => {
            resolve(reader.result as string);
         }
         reader.onerror = reject;
         reader.readAsDataURL(response.data);
      });
   } catch (error) {
      console.error('Error converting image to blob:', error);
      return null
   }
}