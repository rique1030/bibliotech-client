import useRequest from "@/api/request";
import { safeFetch, safeStore } from "@/api/secureStore";
import CONFIG from "@/config";
import { useRouter } from "expo-router";
import React from "react";
import { createContext, useEffect, useState } from "react";
import { useMutation } from "react-query";

interface AuthContextProps {
	user: any;
	loading: boolean;
	login: (email: string, password: string) => void;
	logout: () => void;
	setStaySignedIn: (staySignedIn: boolean) => void;
	staySignedIn: boolean;
}

const AuthContext = createContext<AuthContextProps>({
	user: {},
	loading: false,
	login: (email: string, password: string) => {},
	logout: () => {},
	setStaySignedIn: (staySignedIn: boolean) => {},
	staySignedIn: false,
});

async function FetchUser(email: string, password: string) {
	return await useRequest({
		url: CONFIG.URL.USER.GET_USER_BY_EMAIL_AND_PASSWORD,
		method: "POST" as const,
		payload: {
			email: email,
			password: password,
		},
	});
}

export const AuthProvider = ({ children }: any) => {
	const [user, setUser] = useState(null);
	const [staySignedIn, setStaySignedIn] = useState<boolean>(false);
	const router = useRouter();

	useEffect(() => {
		(async () => {
			const user = await safeFetch("user");
			if (user) {
				login(user.email, user.password);
			} else {
				router.replace("/auth/login");
			}
		})();
	}, []);

	const {
		data: loginResult,
		isLoading: loading,
		mutate,
	} = useMutation({
		mutationFn: (data: any) => FetchUser(data.email, data.password),
		onSuccess: (data: any) => {
			console.log(data);
			if (!data.success) return;
			if (data.data.length === 0) {
				alert("Invalid email or password");
				return;
			}
			if (staySignedIn) safeStore("user", data.data[0]);
			setUser(data.data[0]);
			// router.replace("/browser");
			router.replace("/request");
		},
	});

	const login = async (email: string, password: string) => {
		await mutate({ email, password });
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
