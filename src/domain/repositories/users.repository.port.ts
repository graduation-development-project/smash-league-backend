import { User, UserBankAccount } from "@prisma/client";
import { CreateUserDTO } from "../dtos/users/create-user.dto";
import { TUserWithRole } from "../../infrastructure/types/users.type";
import { EditUserDTO } from "../dtos/users/edit-user.dto";
import { ChangePasswordDTO } from "../dtos/users/change-password.dto";
import { IUserResponse } from "../interfaces/user/user.interface";
import { AddBankAccountDTO } from "../dtos/users/add-bank-account.dto";

export interface UsersRepositoryPort {
	findUserById(userID: string): Promise<TUserWithRole>;

	getAuthenticatedUser(email: string, password: string): Promise<User>;

	getUserByEmail(email: string): Promise<User>;

	getUserProfile(userId: string): Promise<TUserWithRole>;

	getUserWithRefreshToken(userID: string, refreshToken: string): Promise<User>;

	createUser(createUserDTO: CreateUserDTO): Promise<User>;

	editUserProfile(
		userID: string,
		editUserDTO: EditUserDTO,
	): Promise<TUserWithRole>;

	changePassword(
		userID: string,
		changePasswordDTO: ChangePasswordDTO,
	): Promise<TUserWithRole>;

	searchUserByEmail(email: string): Promise<IUserResponse[]>;

	addCreditForUser(userId: string, credit: number): Promise<any>;

	addBankAccount(
		addBankAccountDTO: AddBankAccountDTO,
	): Promise<UserBankAccount>;
}
