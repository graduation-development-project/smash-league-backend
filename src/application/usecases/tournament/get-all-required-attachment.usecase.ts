import { ApiResponse } from "src/domain/dtos/api-response";
import { KeyValueType } from "src/domain/dtos/key-value-type.type";
import { RequiredAttachment } from "src/domain/interfaces/tournament/tournament.interface";

export class GetAllRequiredAttachmentUseCase {
	constructor(
	){
	}

	async execute(): Promise<ApiResponse<KeyValueType<string>[]>> {
		return await new ApiResponse<KeyValueType<string>[]>(
					200,
					"Get all required attachment successfully!",
					Object.entries(RequiredAttachment).map(([key, value]) => ({ key, value }))
				);
	}
}