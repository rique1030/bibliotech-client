import * as Notifications from "expo-notifications";
import { useQuery } from "react-query";
import useRequest, { getURL } from "@/api/request";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { safeFetch, safeStore } from "@/api/secureStore";
const image = require("@/assets/images/default/Logo.png");

async function scheduleDueDateNotification(date: any) {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "Friendly Reminder 📚",
			body: "One of your borrowed books is due today. Please return it on time!",
			sound: true,
			sticky: false,
			priority: Notifications.AndroidNotificationPriority.HIGH,
		},
		trigger: date, // Pass a JavaScript Date object
	});
}

async function scheduleDailyNotification(hour: number, minute: number) {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "Daily Reminder 📖",
			body: "You have borrowed books that are due soon. Please check your library account.",
			sound: true,
			priority: Notifications.AndroidNotificationPriority.HIGH,
		},
		//@ts-ignore
		trigger: {
			hour: hour,
			minute: minute,
			repeats: true, // Makes it repeat daily
		},
	});
}

async function getBorrowedBooks(userID: string) {
	return await useRequest({
		url: (await getURL()).API.RECORDS.BORROWED,
		method: "POST",
		payload: {
			page: 0,
			per_page: 50,
			filters: { user_id: userID },
		},
	});
}

export function useNotification() {
	const { user } = useAuth();
	const [borrowed, setBorrowed] = useState<any[]>([]);

	const { data } = useQuery({
		queryKey: ["books"],
		queryFn: async () => getBorrowedBooks(user?.id),
		cacheTime: 0,
		retry: 2,
		refetchInterval: 1000 * 60 * 10, // 10 minutes
	});

	const handleRemoveDaily = async () => {
		const allSchedule = await Notifications.getAllScheduledNotificationsAsync();
		for (const notif of allSchedule) {
			if (notif.content.body?.includes("You still have borrowed books!")) {
				await Notifications.cancelScheduledNotificationAsync(notif.identifier);
			}
		}
	};
	const handleRemoveDue = async () => {
		const allSchedule = await Notifications.getAllScheduledNotificationsAsync();
		for (const notif of allSchedule) {
			if (
				notif.content.body?.includes("One of your borrowed books is due today!")
			) {
				await Notifications.cancelScheduledNotificationAsync(notif.identifier);
			}
		}
	};
	const handleAddDaily = async () => {
		const allSchedule = await Notifications.getAllScheduledNotificationsAsync();
		const isScheduled = allSchedule.some((notif) =>
			notif.content.body?.includes("You still have borrowed books!")
		);
		if (!isScheduled) {
			await safeStore("dailyNotification", true);
			scheduleDailyNotification(8, 0); // 8:00 AM
		}
	};
	const handleRenewDue = async (items: any) => {
		if (JSON.stringify(items) === JSON.stringify(borrowed)) return;
		setBorrowed(items);
		await handleAddDaily();
		await handleRemoveDue();
		for (const item of items) {
			const dueDate = new Date(item.due_date);
			scheduleDueDateNotification(dueDate);
		}
	};
	useEffect(() => {
		if (data) {
			const items: any[] = data?.data?.items || [];
			if (items.length > 0) {
				handleRenewDue(items);
			} else {
				handleRemoveDaily();
			}
		}
	}, [data]);
	return null;
}
