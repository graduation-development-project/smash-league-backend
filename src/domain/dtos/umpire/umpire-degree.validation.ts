import { TypeOfUmpireDegree } from "@prisma/client";

export class CreateUmpireDegreeDto {
	typeOfDegree: TypeOfUmpireDegree;
	description?: string;
}