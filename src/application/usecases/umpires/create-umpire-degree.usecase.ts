import { HttpStatus, Inject } from "@nestjs/common";
import { UmpireDegree } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { CreateUmpireDegreeDto } from "src/domain/dtos/umpire/umpire-degree.validation";
import { IFileHandler } from "src/domain/interfaces/file/file.interface";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { UmpireDegreeRepositoryPort } from "src/domain/repositories/umpire-degree.repository.port";
import { UploadService } from "src/infrastructure/services/upload.service";

export class CreateUmpireDegreeUseCase {
	constructor(
		@Inject("UmpireDegreeRepository")
		private readonly umpireDegreeRepository: UmpireDegreeRepositoryPort,
		private readonly uploadService: UploadService
	) {
	}

	async execute(request: IRequestUser, createUmpireDegree: CreateUmpireDegreeDto, files: Express.Multer.File[]): Promise<ApiResponse<UmpireDegree>> {
		console.log(files.length);
		const images: IFileHandler[] = await this.uploadService.uploadFiles(files, "umpire-degree", request.user.id);
		const umpireDegree = await this.umpireDegreeRepository.createUmpireDegree({
			...createUmpireDegree,
			degree: images.map(image => image.secure_url),
			userId: request.user.id
		});
		return new ApiResponse<UmpireDegree>(
			HttpStatus.CREATED,
			"Create new umpire degree success!",
			umpireDegree
		);
	}
}