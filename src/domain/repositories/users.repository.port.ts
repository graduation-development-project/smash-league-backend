import { User } from "@prisma/client";
import { CreateUserDTO } from "../../infrastructure/dto/users/create-user.dto";
import { TUserWithRole } from "../../infrastructure/types/users.type";
import { EditUserDTO } from "../../infrastructure/dto/users/edit-user.dto";

export interface UsersRepositoryPort {
	findUserById(userID: string): Promise<TUserWithRole>;

	getAuthenticatedUser(email: string, password: string): Promise<User>;

	getUserByEmail(email: string): Promise<User>;

	getUserWithRefreshToken(userID: string, refreshToken: string): Promise<User>;

	createUser(createUserDTO: CreateUserDTO): Promise<User>;

	editUserProfile(userID: string, editUserDTO: EditUserDTO): Promise<TUserWithRole>;
}
