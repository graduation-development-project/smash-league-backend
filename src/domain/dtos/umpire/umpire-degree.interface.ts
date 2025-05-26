import { TypeOfUmpireDegree } from "@prisma/client";
import { IUserResponse } from "src/domain/interfaces/user/user.interface";

export interface UmpireDegreeResponse {
	id: string;
	typeOfDegree: TypeOfUmpireDegree;
	degreeTitle: string;
	degree: string[];
	description?: string;
	user: IUserResponse;
}

export class ICreateUmpireDegree {
	typeOfDegree: TypeOfUmpireDegree;
	degreeTitle: string;
	degree: string[];
	description?: string;
	userId: string;
}

export interface IUpdateUmpireDegree {
	id: string; 
	degreeTitle: string;
	degree: string[];
	description?: string;
	userId: string;
}