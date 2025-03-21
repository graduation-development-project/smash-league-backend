export const calculateAgeUtil = (birthDateTime: Date): number => {
	if (!birthDateTime) {
		return null;
	}

	let birthDate;

	if (typeof birthDateTime === "string") {
		birthDate = new Date(birthDateTime);
	} else if (birthDateTime instanceof Date) {
		birthDate = birthDateTime;
	} else {
		return null;
	}

	if (isNaN(birthDate.getTime())) {
		return null;
	}

	const today = new Date();
	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDifference = today.getMonth() - birthDate.getMonth();

	if (
		monthDifference < 0 ||
		(monthDifference === 0 && today.getDate() < birthDate.getDate())
	) {
		age--;
	}

	return age;
};
