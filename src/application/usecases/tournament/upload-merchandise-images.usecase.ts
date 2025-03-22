import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UploadService } from "src/infrastructure/services/upload.service";

@Injectable()
export class UploadMerchandiseImagesUseCase {
	constructor(
		private readonly uploadService: UploadService
	){
	}

	async execute(files: Express.Multer.File[]) : Promise<ApiResponse<string[]>> {
			const folderName = `tournament-merchandise/${new Date().toISOString().split("T")[0]}`;

			const imageUrls = await this.uploadService.uploadFiles(
				files,
				folderName,
				""
			);
		return new ApiResponse<string[]>(
			HttpStatus.OK,
			"Upload merchandise images of tournament successful!",
			imageUrls.map(image => image.secure_url)
		);		
	}
}