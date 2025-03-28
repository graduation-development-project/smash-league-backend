import * as bcrypt from "bcryptjs";
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Gender, PrismaClient, User } from "@prisma/client";
import { UsersRepositoryPort } from "../../domain/repositories/users.repository.port";
import { CreateUserDTO } from "../../domain/dtos/users/create-user.dto";
import { TUserWithRole } from "../types/users.type";
import { RoleMap } from "../enums/role.enum";
import { EditUserDTO } from "../../domain/dtos/users/edit-user.dto";
import { ChangePasswordDTO } from "../../domain/dtos/users/change-password.dto";
import { IUserResponse } from "src/domain/interfaces/user/user.interface";

@Injectable()
export class PrismaUsersRepositoryAdapter implements UsersRepositoryPort {
	constructor(private prisma: PrismaClient) {}

	async addCreditForUser(userId: string, credit: number): Promise<any> {
		const creditsRemain = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: {
				creditsRemain: true,
			},
		});
		return await this.prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				creditsRemain: creditsRemain.creditsRemain + credit,
			},
			select: {
				id: true,
				name: true,
				phoneNumber: true,
				email: true,
				creditsRemain: true,
			},
		});
	}

	async searchUserByEmail(email: string): Promise<IUserResponse[]> {
		return await this.prisma.user.findMany({
			where: {
				email: {
					contains: email,
				},
				isVerified: true,
			},
			select: {
				id: true,
				avatarURL: true,
				name: true,
				email: true,
				phoneNumber: true,
				isVerified: true,
			},
		});
	}

	async findUserById(userID: string): Promise<TUserWithRole> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: userID },
				include: { userRoles: { include: { role: true } } },
				omit: { password: true },
			});

			const roles = user.userRoles.map((item) => item.role.roleName);

			return {
				...user,
				// @ts-ignore
				userRoles: roles,
			} as TUserWithRole;
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
			const user = await this.prisma.user.findUnique({
				where: { email: email },
				include: { userRoles: { include: {role: true} } },
			});

			if (!user) {
				throw new UnauthorizedException("Wrong email or password");
			}

			await this.verifyPlainContentWithHashedContent(password, user.password);

			delete user.password;

			const roles = user.userRoles.map((item) => item.role.roleName);

			return {
				...user,
				// @ts-ignore
				userRoles: roles,
			} as TUserWithRole;
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
			const { avatarURL, currentRefreshToken, provider, ...rest } =
				createUserDTO;

			//* Set default data for user avatar, currentRefreshToken, CreditsRemain
			const userData = {
				...rest,
				avatarURL:
					avatarURL ||
					"https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
				currentRefreshToken: currentRefreshToken ?? null,
				creditsRemain: 0,
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

			const updatedUser = await this.prisma.user.update({
				where: {
					id: userID,
				},
				data: {
					...editUserDTO,
				},

				omit: {
					password: true,
				},

				include: { userRoles: { include: { role: true } } },
			});

			const roles = updatedUser.userRoles.map((item) => item.role.roleName);

			return {
				...updatedUser,
				// @ts-ignore
				userRoles: roles,
			} as TUserWithRole;
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

			const updatedUser = await this.prisma.user.update({
				where: {
					id: userID,
				},
				data: {
					password: hashedPassword,
				},

				omit: {
					password: true,
				},

				include: { userRoles: { include: { role: true } } },
			});

			const roles = updatedUser.userRoles.map((item) => item.role.roleName);

			return {
				...updatedUser,
				userRoles: roles,
			} as TUserWithRole;
		} catch (e) {
			throw e;
		}
	}

	async getUserProfile(userId: string): Promise<TUserWithRole> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { id: userId },
				omit: { password: true },
				include: { userRoles: { include: { role: true } } },
			});

			const roles = user.userRoles.map((item) => item.role.roleName);

			return {
				...user,
				// @ts-ignore
				userRoles: roles,
			} as TUserWithRole;
		} catch (e) {
			throw new BadRequestException("User not found");
		}
	}
}
