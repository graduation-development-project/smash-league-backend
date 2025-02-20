import { IsString, IsNotEmpty } from "class-validator";

export class CreateNotificationDTO {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	message: string;

	@IsString()
	@IsNotEmpty()
	type: string;
}
