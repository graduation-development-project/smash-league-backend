import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RemoveTeamMemberDTO {
	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsString()
	@IsOptional()
	teamLeaderId?: string;

	@IsArray()
	@IsNotEmpty()
	teamMemberIds: string[];

	@IsString()
	@IsNotEmpty()
	reason: string;
}
