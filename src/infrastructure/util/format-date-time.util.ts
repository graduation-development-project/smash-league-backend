export function formatDate(dateTimeString: Date) {
	const date = new Date(dateTimeString);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

// export function getCurrentTime(time: Date, locale: string = "vi-VN"): string {
// 	const now = new Date(time);
// 	const options: Intl.DateTimeFormatOptions = {
// 		hour: "numeric",
// 		minute: "numeric",
// 		second: "numeric",
// 	};
// 	return now.toLocaleTimeString(locale, options);
// }

export function getCurrentTime(time: Date): string {
	const date = new Date(time);
	const hours = date.getUTCHours().toString().padStart(2, "0");
	const minutes = date.getUTCMinutes().toString().padStart(2, "0");
	const seconds = date.getUTCSeconds().toString().padStart(2, "0");
	return `${hours}:${minutes}:${seconds}`;
}
