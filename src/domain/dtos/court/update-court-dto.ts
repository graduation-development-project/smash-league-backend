import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateCourtDTO {
	@IsString()
	@IsOptional()
	courtCode?: string;

	@IsBoolean()
	@IsOptional()
	courtAvailable?: boolean;
}
