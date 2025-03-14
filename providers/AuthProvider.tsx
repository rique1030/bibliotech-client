import useRequest, { getURL } from "@/api/request";
import { safeFetch, safeStore } from "@/api/secureStore";
import { useGlobalToast } from "@/hooks/useToast";
import { RelativePathString, useRouter } from "expo-router";
import React, { useRef } from "react";
import { createContext, useEffect, useState } from "react";
import { BackHandler } from "react-native";
import { useMutation } from "react-query";
// notifications
import * as Notifications from "expo-notifications";

interface AuthContextProps {
	user: any;
	setUser: (user: any) => void;
	loading: boolean;
	login: (
		email: string,
		password: string,
		successPath?: RelativePathString,
		failurePath?: RelativePathString
	) => Promise<boolean>;
	logout: () => void;
	setStaySignedIn: (staySignedIn: boolean) => void;
	staySignedIn: boolean;
}

const AuthContext = createContext<AuthContextProps>({
	user: {},
	setUser: () => {},
	loading: false,
	login: (
		email: string,
		password: string,
		successPath?: RelativePathString,
		failurePath?: RelativePathString
	) => new Promise(() => {}),
	logout: () => {},
	setStaySignedIn: (staySignedIn: boolean) => {},
	staySignedIn: false,
});

async function FetchUser(email: string, password: string) {
	const config = await getURL();
	return await useRequest({
		url: config.API.USERS.GET_LOGIN,
		method: "POST" as const,
		payload: {
			email: email,
			password: password,
		},
	});
}

async function requestPermissions() {
	const { status } = await Notifications.getPermissionsAsync();
	if (status !== "granted") {
		await Notifications.requestPermissionsAsync();
	}
}

export const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState(null);
	const [staySignedIn, setStaySignedIn] = useState<boolean>(false);
	const { showToast } = useGlobalToast();
	const router = useRouter();
	const logged_in = useRef<any>(null);

	const { isLoading: loading, mutate } = useMutation({
		mutationFn: (data: any) => FetchUser(data.email, data.password),
		onSuccess: (data: any) => {
			if (!data.success) {
				return showToast(
					"Something went wrong. Please try again later.",
					"error",
					5000
				);
			}
			const user = data.data[0];
			if (!user) {
				// invalid email or password
				logged_in.current(false);
				return showToast("Invalid email or password", "error", 5000);
			} // valid email and password
			if (staySignedIn) safeStore("user", user);
			setUser(user);
			logged_in.current(true);
		},
	});

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: false,
		}),
	});

	useEffect(() => {
		requestPermissions();
		const subscription = Notifications.addNotificationReceivedListener(
			(notification) => {
				console.log("Notification received:", notification);
			}
		);
		handlePreLogin();
		return () => subscription.remove();
	}, []);

	const handlePreLogin = async () => {
		safeFetch("user").then((user) => {
			if (user) {
				login(
					user.email,
					user.password,
					"/browser" as RelativePathString,
					"/auth/login" as RelativePathString
				);
			} else {
				router.replace("/auth/login");
			}
		});
	};

	const login = async (
		email: string,
		password: string,
		successPath?: RelativePathString,
		failurePath?: RelativePathString
	) => {
		return new Promise<boolean>((resolve) => {
			logged_in.current = resolve;
			mutate({ email, password });
		}).then((res) => {
			if (res && successPath) {
				router.replace(successPath);
			} else if (!res && failurePath) {
				router.replace(failurePath);
			}
			return res;
		});
	};

	const logout = async () => {
		await safeStore("user", null);
		setUser(null);
		router.replace("/auth/login");
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				loading,
				staySignedIn,
				setStaySignedIn,
				login,
				logout,
			}}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => React.useContext(AuthContext);
