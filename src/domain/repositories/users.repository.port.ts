import { User } from "@prisma/client";
import { CreateUserDTO } from "../../infrastructure/dto/users/create-user.dto";

export interface UsersRepositoryPort {
	findUserById(userID: number): Promise<User>;

	getAuthenticatedUser(email: string, password: string): Promise<User>;

	getUserByEmail(email: string): Promise<User>;

	getUserWithRefreshToken(userID: number, refreshToken: string): Promise<User>;

	createUser(createUserDTO: CreateUserDTO): Promise<User>;
}
