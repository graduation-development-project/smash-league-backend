import { Timestamp } from "rxjs";

export class UnauthenticatedUnauthorizationErrorResponse<T> {
	statusCode: number;
	message: string;
	timestamp: Date;
	error: T;
}