import { Inject, Injectable } from "@nestjs/common";
import { AthletesRepositoryPort } from "../../../domain/repositories/athletes.repository.port";
import { TCloudinaryResponse } from "../../../infrastructure/types/cloudinary.type";

@Injectable()
export class UploadVerificationImagesUseCase {
	constructor(
		@Inject("AthleteRepository") private athletesRepository: AthletesRepositoryPort,
	) {}

	execute(
		files: Express.Multer.File[],
		userID: string,
	): Promise<TCloudinaryResponse[]> {
		return this.athletesRepository.uploadVerificationImage(files, userID);
	}
}
