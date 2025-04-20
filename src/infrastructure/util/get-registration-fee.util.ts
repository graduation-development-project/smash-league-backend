export function getRegistrationFee(event: any): number {
	const isDouble = event.tournamentEvent.toUpperCase().includes("DOUBLE");
	return isDouble
		? event.tournament.registrationFeePerPair
		: event.tournament.registrationFeePerPerson;
}
