export interface StaffsRepositoryPort {
	verifyUserInformation(
		verificationID: string,
		option: boolean,
		rejectionReason?: string,
	): Promise<string>;
}
