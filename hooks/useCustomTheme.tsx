import darkTheme from "@/themes/dark";
import lightTheme from "@/themes/light";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export default function useCustomTheme() {
	const [currentTheme, setCurrentTheme] = useState(darkTheme);
	let colorScheme = useColorScheme();
	
	useEffect(() => {
		if (colorScheme === "dark") {
			setCurrentTheme(darkTheme);
		} else{
			setCurrentTheme(lightTheme);
		}
	}, [colorScheme])

	const toggleTheme = () => {
		setCurrentTheme((prevTheme) => {
			return prevTheme === lightTheme ? darkTheme : lightTheme;
		});
	};

	return {
		theme: currentTheme,
		toggleTheme,
	};
}
