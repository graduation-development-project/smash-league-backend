import { Inject, Injectable } from "@nestjs/common";
import { StaffsRepositoryPort } from "../../../domain/repositories/staffs.repository.port";

@Injectable()
export class VerifyUserInformationUseCase {
	constructor(
		@Inject("StaffRepository") private staffRepository: StaffsRepositoryPort,
	) {}

	execute(verificationID: string, option: boolean, rejectionReason?: string): Promise<string> {
		return this.staffRepository.verifyUserInformation(verificationID, option, rejectionReason);
	}
}
