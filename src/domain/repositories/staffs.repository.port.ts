import { UserVerification } from "@prisma/client";

export interface StaffsRepositoryPort {
	verifyUserInformation(
		verificationID: string,
		option: boolean,
		rejectionReason?: string,
	): Promise<string>;

	getAllVerificationRequest(): Promise<UserVerification[]>;
}
