export function formatDate(dateTimeString: Date) {
	const date = new Date(dateTimeString);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

export function getCurrentTime(time: Date, locale: string = "vi-VN"): string {
	const now = new Date(time);
	const options: Intl.DateTimeFormatOptions = {
		hour: "numeric",
		minute: "numeric",
		second: "numeric",
	};
	return now.toLocaleTimeString(locale, options);
}
