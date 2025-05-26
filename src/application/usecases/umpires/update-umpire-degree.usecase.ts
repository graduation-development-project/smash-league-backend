import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { Injector } from "@nestjs/core/injector/injector";
import { UmpireDegree } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UpdateUmpireDegreeDto } from "src/domain/dtos/umpire/umpire-degree.validation";
import { IFileHandler } from "src/domain/interfaces/file/file.interface";
import { IRequestUser } from "src/domain/interfaces/interfaces";
import { UmpireDegreeRepositoryPort } from "src/domain/repositories/umpire-degree.repository.port";
import { UploadService } from "src/infrastructure/services/upload.service";

@Injectable()
export class UpdateUmpireDegreeUseCase {
	constructor(
		@Inject("UmpireDegreeRepository")
		private readonly umpireDegreeRepository: UmpireDegreeRepositoryPort,
		private readonly uploadService: UploadService
	) {
	}

	async execute(request: IRequestUser, updateUmpireDegree: UpdateUmpireDegreeDto,
		files: Express.Multer.File[]
	): Promise<ApiResponse<UmpireDegree>> {
		const umpireDegree = await this.umpireDegreeRepository.getUmpireDegreeById(updateUmpireDegree.id);
		const images: IFileHandler[] = await this.uploadService.uploadFiles(files, "umpire-degree", request.user.id);
		if (umpireDegree === null) return new ApiResponse<null | undefined>(
			HttpStatus.BAD_REQUEST,
			"No degree found!",
			null
		);
		return new ApiResponse<UmpireDegree>(
			HttpStatus.NO_CONTENT,
			"Update umpire degree success!",
			await this.umpireDegreeRepository.updateUmpireDegree({
				...updateUmpireDegree, 
				degree: images.map(image => image.secure_url),
				userId: request.user.id
			})
		);
	}
}