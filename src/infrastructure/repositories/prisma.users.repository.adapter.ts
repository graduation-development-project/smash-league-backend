import * as bcrypt from "bcryptjs";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaClient, User } from "@prisma/client";
import { UsersRepositoryPort } from "../../domain/repositories/users.repository.port";
import { CreateUserDTO } from "../dto/users/create-user.dto";
import { TUserWithRole } from "../types/users.type";
import { EditUserDTO } from "../dto/users/edit-user.dto";

@Injectable()
export class PrismaUsersRepositoryAdapter implements UsersRepositoryPort {
	constructor(private prisma: PrismaClient) {
	}

	async findUserById(userID: string): Promise<TUserWithRole> {

		try {
			const user: User = await this.prisma.user.findUnique({
				where: { id: userID },
				include: { userRoles: { select: { roleId: true } } },
			});

			return {
				...user,
				// @ts-ignore
				userRoles: user?.userRoles?.map((role: { roleId: string; }) => role.roleId),
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


	async getAuthenticatedUser(email: string, password: string): Promise<TUserWithRole> {
		try {
			// console.log(email, password);
			const user: User = await this.prisma.user.findUnique({
				where: { email: email },
				include: { userRoles: { select: { roleId: true } } },
			});

			await this.verifyPlainContentWithHashedContent(password, user.password);
			return {
				...user,
				// @ts-ignore
				userRoles: user.userRoles.map((role: { roleId: string; }) => role.roleId),
			};
		} catch (e) {
			throw new BadRequestException("Wrong credentials.");
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
			throw new BadRequestException("User not found");
		}
	}

	async createUser(createUserDTO: CreateUserDTO): Promise<User> {
		try {
			// console.log(createUserDTO)

			//* Set default data for user avatar, currentRefreshToken
			const userData = {
				...createUserDTO,
				avatarURL:
					createUserDTO.avatarURL ||
					"https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
				currentRefreshToken: createUserDTO.currentRefreshToken || null,
				CreditsRemain: 0,
			};

			return await this.prisma.user.create({ data: userData });
		} catch (e) {
			throw new BadRequestException("Create user failed");
		}
	}

	async editUserProfile(userID: string, editUserDTO: EditUserDTO): Promise<TUserWithRole> {
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
				userRoles: updatedUser?.userRoles.length > 0 ? updatedUser?.userRoles?.map((role: {
					roleId: string;
				}) => role.roleId) : [],
			};

		} catch (e) {
			throw new BadRequestException("Edit user failed");
		}
	}

}
