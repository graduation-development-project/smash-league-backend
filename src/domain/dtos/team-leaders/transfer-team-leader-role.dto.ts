import {IsNotEmpty, IsOptional, IsString} from "class-validator";
import {User} from "@prisma/client";

export class TransferTeamLeaderRoleDTO {
    @IsString()
    @IsNotEmpty()
    teamId: string;

    @IsOptional()
    user: User

    @IsString()
    @IsNotEmpty()
    newTeamLeaderId: string;
}