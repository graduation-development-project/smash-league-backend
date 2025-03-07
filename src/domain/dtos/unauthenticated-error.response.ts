import { Timestamp } from "rxjs";

export class UnauthenticatedUnauthorizationErrorResponse<T> {
	statusCode: number;
	message: string;
	timestamp: Date;
	error: T;

	constructor(statusCode: number, message: string, error: T) {
		this.statusCode = statusCode;
		this.message = message;
		this.timestamp = new Date();
		this.error = error;
	}
}