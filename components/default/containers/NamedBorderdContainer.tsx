import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function NamedBorderedContainer({ label="",  children }: any) {
   const theme = useTheme()
   const styles = StyleSheet.create({
		textBoxContainer : { padding: 10, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.outlineVariant }
	});
  return (
   <View style={styles.textBoxContainer}>
      <Text style={{color: theme.colors.primary }}>{label}</Text>
      {children}
   </View>
  );
}