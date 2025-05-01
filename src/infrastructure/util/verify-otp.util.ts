import { User } from "@prisma/client";
import { BadRequestException } from "@nestjs/common";
import { convertToLocalTime } from "./convert-to-local-time.util";

export const verifyOTP = async (
	email: string,
	otp: string,
	prisma: any,
): Promise<void> => {
	const user: User = await prisma.user.findUnique({
		where: { email },
	});

	console.log("USER", user, email);

	if (!user) {
		throw new BadRequestException("This email is not registered yet");
	}

	//* Check OTP expires or not
	if (user.otpExpiresTime < convertToLocalTime(new Date())) {
		throw new BadRequestException("OTP expired");
	}

	console.log("OTP expires at (UTC):", user.otpExpiresTime);
	console.log("Current time (UTC):",convertToLocalTime(new Date()));

	if (user.otp !== otp) {
		throw new BadRequestException("Invalid OTP");
	}
};
