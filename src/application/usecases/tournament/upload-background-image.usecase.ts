import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UploadService } from "src/infrastructure/services/upload.service";

@Injectable()
export class UploadBackgroundImageUseCase {
	constructor(
		private readonly uploadService: UploadService
	) {
	}

	async execute(backgroundImage: Express.Multer.File[]) : Promise<ApiResponse<string>> {
		if (backgroundImage.length > 1) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Cannot upload more than 1 image.",
			null
		);
		const folderName = `tournament-background/${new Date().toISOString().split("T")[0]}`;

			const imageUrls = await this.uploadService.uploadFiles(
				backgroundImage,
				folderName,
				""
			);
		return new ApiResponse<string>(
			HttpStatus.OK,
			"Upload background image of tournament successful!",
			imageUrls[0].secure_url
		);
	}
}