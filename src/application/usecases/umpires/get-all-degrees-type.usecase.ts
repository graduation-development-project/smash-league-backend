import { Injectable } from "@nestjs/common";
import { TypeOfUmpireDegree } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { KeyValueType } from "src/domain/dtos/key-value-type.type";
@Injectable()
export class GetAllDegreeTypeUseCase {
	constructor(
	) {
	}

	async execute(): Promise<ApiResponse<KeyValueType<string>[]>> {
		return await new ApiResponse<KeyValueType<string>[]>(
			200,
			"Get all umpire degree success!",
			Object.entries(TypeOfUmpireDegree).map(([key, value]) => ({ key, value }))
		);
	}
}