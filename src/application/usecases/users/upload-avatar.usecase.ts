import { HttpStatus, Injectable } from "@nestjs/common";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UploadService } from "src/infrastructure/services/upload.service";

@Injectable()
export class UploadAvatarUseCase {
	constructor(
		private readonly uploadService: UploadService
	) {
	}

	async execute(avatar: Express.Multer.File[]) : Promise<ApiResponse<string>> {
		if (avatar.length > 1) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"Cannot upload more than 1 image.",
			null
		);
		const folderName = `users/avatar/${new Date().toISOString().split("T")[0]}`;

		const imageUrls = await this.uploadService.uploadFiles(
			avatar,
			folderName,
			""
		);
		return new ApiResponse<string>(
			HttpStatus.OK,
			"Upload avatar successful!",
			imageUrls[0].secure_url
		);
	}
}