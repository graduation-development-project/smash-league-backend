import { HttpStatus } from '@nestjs/common';
import { Package } from '@prisma/client';
import { ApiResponse } from 'src/domain/dtos/api-response';
import { MatchLogDetail, MatchLogDetailList } from 'src/domain/enums/match/match-log.enum';
export class GetAllLogMessageUseCase {
	constructor(
	){ 
	}

	async execute(): Promise<ApiResponse<MatchLogDetail[]>> {
		return new ApiResponse<MatchLogDetail[]>(
			HttpStatus.OK,
			"Get all message log success!",
			MatchLogDetailList
		);
	}
}