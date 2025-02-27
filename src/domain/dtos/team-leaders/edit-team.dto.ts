import { PartialType } from "@nestjs/mapped-types";
import { CreateTeamDTO } from "./create-team.dto";
import {IsNotEmpty, IsOptional, IsString} from "class-validator";

export class EditTeamDTO extends PartialType(CreateTeamDTO) {
	@IsString()
	@IsNotEmpty()
	teamId: string;

	@IsOptional()
	teamLeaderId: string;
}
