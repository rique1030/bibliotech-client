import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTheme, Text } from "react-native-paper";
import BookComponent from "./BookComponent";


export function BorrowPanel({ books }: { books: string[] }) {
   const theme = useTheme();

   const styles = StyleSheet.create({
      booksContainer: {
         display: "flex",
         flexDirection: "row",
         overflowX: "auto",
         width: "100%",
         boxSizing: "border-box",
         backgroundColor: "rgba(0, 0, 0, 0.1)",
         padding: 10,
         borderRadius: 10,
         gap: 10,
         borderColor: theme.colors.outlineVariant
      }
   });

   return (
      <>
         <Text
            variant="bodyLarge"
            style={{ fontWeight: "bold", color: theme.colors.primary }}>
            BORROWED BOOKS
         </Text>
         {books.length === 0 ? (
            <Text variant="bodyMedium" style={{ color: "gray" }}>
               No book borrowed
            </Text>
         ) : (
            <View
               style={styles.booksContainer}>
               <ScrollView horizontal>
                  <View style={{ display: "flex", flexDirection: "row", gap: 10 }}>
                     {books.map((book: any, index) => (
                        <BookComponent
                           key={index}
                           book={book}
                           bookTitle={book?.title as unknown as string}
                        />
                     ))}
                  </View>
               </ScrollView>
            </View>
         )}
      </>
   );
};