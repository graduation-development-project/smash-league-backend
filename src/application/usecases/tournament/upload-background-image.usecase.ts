import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UploadService } from "src/infrastructure/services/upload.service";

@Injectable()
export class UploadBackgroundImageUseCase {
	constructor(
		private readonly uploadService: UploadService
	) {
	}

	async execute(files: Express.Multer.File[]) : Promise<ApiResponse<string[]>> {
		const folderName = `tournament-background/${new Date().toISOString().split("T")[0]}`;

			const imageUrls = await this.uploadService.uploadFiles(
				files,
				folderName,
				""
			);
		return new ApiResponse<string[]>(
			HttpStatus.OK,
			"Upload background image of tournament successful!",
			imageUrls.map(image => image.secure_url)
		);
	}
}