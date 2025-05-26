import { UmpireDegree } from "@prisma/client";
import { ICreateUmpireDegree, UmpireDegreeResponse } from "../dtos/umpire/umpire-degree.interface";

export interface UmpireDegreeRepositoryPort {
	getAllDegreeOfUmpire(umpireId: string): Promise<UmpireDegreeResponse[]>;
	createUmpireDegree(createUmpireDegree: ICreateUmpireDegree): Promise<UmpireDegree>;
	createMultipleUmpireDegree(): Promise<UmpireDegree[]>;
	updateUmpireDegree(): Promise<any>;
	updateImageForDegree(degreeId: string, degreeImages: string[]): Promise<UmpireDegree>;
	deleteUmpireDegree(degreeId: string): Promise<any>;
	getUmpireDegreeById(degreeId: string): Promise<UmpireDegree>;
}