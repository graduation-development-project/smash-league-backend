import * as bcrypt from "bcryptjs";
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { UsersRepositoryPort } from "../../domain/repositories/users.repository.port";
import { CreateUserDTO } from "../../domain/dtos/users/create-user.dto";
import { TUserWithRole } from "../types/users.type";
import { RoleMap } from "../enums/role.enum";
import { EditUserDTO } from "../../domain/dtos/users/edit-user.dto";
import { ChangePasswordDTO } from "../../domain/dtos/users/change-password.dto";

@Injectable()
export class PrismaUsersRepositoryAdapter implements UsersRepositoryPort {
	constructor(private prisma: PrismaClient) {}

	async findUserById(userID: string): Promise<TUserWithRole> {
		try {
			const user: User = await this.prisma.user.findUnique({
				where: { id: userID },
				include: { userRoles: { select: { roleId: true } } },
			});

			return {
				...user,
				// @ts-ignore
				userRoles: user.userRoles.map(
					(role: { roleId: string }) => role.roleId,
				),
			};
		} catch (e) {
			throw new BadRequestException("User not found");
		}
	}

	async getUserByEmail(email: string): Promise<User> {
		try {
			return this.prisma.user.findUnique({ where: { email: email } });
		} catch (e) {
			throw new BadRequestException("Get user by email failed.");
		}
	}

	private async verifyPlainContentWithHashedContent(
		plain_text: string,
		hashed_text: string,
	): Promise<void> {
		const is_matching = await bcrypt.compare(plain_text, hashed_text);
		if (!is_matching) {
			throw new BadRequestException("Token not matching");
		}
	}

	async getAuthenticatedUser(
		email: string,
		password: string,
	): Promise<TUserWithRole> {
		try {
			// console.log(email, password);
			const user: User = await this.prisma.user.findUnique({
				where: { email: email },
				include: { userRoles: { select: { roleId: true } } },
			});

			if (!user) {
				throw new UnauthorizedException("Wrong email or password");
			}

			await this.verifyPlainContentWithHashedContent(password, user.password);

			return {
				...user,
				// @ts-ignore
				userRoles: user.userRoles.map(
					(role: { roleId: string }) => role.roleId,
				),
			};
		} catch (e) {
			throw e;
		}
	}

	async getUserWithRefreshToken(
		userID: string,
		refreshToken: string,
	): Promise<User> {
		try {
			const user: User = await this.prisma.user.findUnique({
				where: { id: userID },
			});

			if (!user) {
				throw new UnauthorizedException();
			}
			await this.verifyPlainContentWithHashedContent(
				refreshToken,
				user.currentRefreshToken,
			);
			return user;
		} catch (e) {
			throw e;
		}
	}

	async createUser(createUserDTO: CreateUserDTO): Promise<User> {
		try {
			// console.log(createUserDTO)
			const { avatarURL, currentRefreshToken, provider, ...rest } = createUserDTO;

			//* Set default data for user avatar, currentRefreshToken, CreditsRemain
			const userData = {
				...rest,
				avatarURL:
					avatarURL ||
					"https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
				currentRefreshToken: currentRefreshToken ?? null,
				CreditsRemain: 0,
				isVerified: provider === "google",
			};

			return await this.prisma.$transaction(async (prisma): Promise<User> => {
				const user: User = await prisma.user.create({ data: userData });
				await prisma.userRole.create({
					data: { roleId: RoleMap.Athlete.id.toString(), userId: user.id },
				});
				return user;
			});
		} catch (e) {
			throw e;
		}
	}

	async editUserProfile(
		userID: string,
		editUserDTO: EditUserDTO,
	): Promise<TUserWithRole> {
		try {
			// console.log(editUserDTO);

			const updatedUser: User = await this.prisma.user.update({
				where: {
					id: userID,
				},
				data: {
					...editUserDTO,
				},

				include: { userRoles: { select: { roleId: true } } },
			});

			return {
				...updatedUser,
				// @ts-ignore
				userRoles:
					// @ts-ignore
					updatedUser?.userRoles.length > 0
						? // @ts-ignore
							updatedUser?.userRoles?.map(
								(role: { roleId: string }) => role.roleId,
							)
						: [],
			};
		} catch (e) {
			throw new e();
		}
	}

	async changePassword(
		userID: string,
		changePasswordDTO: ChangePasswordDTO,
	): Promise<TUserWithRole> {
		try {
			const { repeatNewPassword, oldPassword, newPassword } = changePasswordDTO;

			const user: User = await this.prisma.user.findUnique({
				where: { id: userID },
			});

			await this.verifyPlainContentWithHashedContent(
				oldPassword,
				user.password,
			);

			if (newPassword !== repeatNewPassword) {
				throw new BadRequestException("Password not match");
			}

			const hashedPassword: string = await bcrypt.hash(newPassword, 10);

			const updatedUser: User = await this.prisma.user.update({
				where: {
					id: userID,
				},
				data: {
					password: hashedPassword,
				},

				include: { userRoles: { select: { roleId: true } } },
			});

			return {
				...updatedUser,
				userRoles:
					// @ts-ignore
					updatedUser?.userRoles.length > 0
						? // @ts-ignore
							updatedUser?.userRoles?.map(
								(role: { roleId: string }) => role.roleId,
							)
						: [],
			};
		} catch (e) {
			throw e;
		}
	}
}
