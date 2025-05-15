import { TypeOfUmpireDegree } from "@prisma/client";

export class CreateUmpireDegreeDto {
	degreeTitle: string;
	typeOfDegree: TypeOfUmpireDegree;
	description?: string;
}