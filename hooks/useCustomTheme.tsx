import darkTheme from "@/themes/dark";
import lightTheme from "@/themes/light";
import { useState } from "react";

export default function useCustomTheme() {
	const [currentTheme, setCurrentTheme] = useState(darkTheme);

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
