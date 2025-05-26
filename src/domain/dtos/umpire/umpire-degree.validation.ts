import { TypeOfUmpireDegree } from "@prisma/client";

export class CreateUmpireDegreeDto {
	degreeTitle: string;
	typeOfDegree: TypeOfUmpireDegree;
	description?: string;
}

export class UpdateUmpireDegreeDto {
	id: string;
	degreeTitle: string;
	typeOfDegree: TypeOfUmpireDegree;
	description?: string;
}
