import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepository } from "../../../domain/repositories/athletes.repository";
import { TCloudinaryResponse } from "../../../infrastructure/types/cloudinary.type";

@Injectable()
export class UploadVerificationImagesUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepository,
	) {}

	execute(
		files: Express.Multer.File[],
		userID: string,
	): Promise<TCloudinaryResponse[]> {
		return this.athletesRepository.uploadVerificationImage(files, userID);
	}
}
