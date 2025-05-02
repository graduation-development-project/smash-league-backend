export const checkIfOverOneMonth = (date: Date, dateToCompare: Date): boolean => {
	var dateOneMonthFurther = new Date(date);
	dateToCompare = new Date(dateToCompare);
	dateOneMonthFurther.setDate(date.getDate() + 30);
	console.log(dateToCompare, " ", dateOneMonthFurther);
	console.log(dateToCompare > dateOneMonthFurther);
	if (dateToCompare > dateOneMonthFurther) return true;
	return false;
}