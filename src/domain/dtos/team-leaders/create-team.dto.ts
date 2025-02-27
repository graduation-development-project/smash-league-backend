import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import {TUserWithRole} from "../../../infrastructure/types/users.type";

export class CreateTeamDTO {
	@IsNotEmpty()
	teamLeader: TUserWithRole;

	@IsString()
	@IsNotEmpty()
	teamName: string;

	@IsNotEmpty()
	@IsArray()
	logo: Express.Multer.File[];

	@IsString()
	@IsNotEmpty()
	@IsOptional()
	description: string;
}
