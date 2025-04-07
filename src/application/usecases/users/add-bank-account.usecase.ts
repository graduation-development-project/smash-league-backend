import { HttpStatus, Inject } from "@nestjs/common";
import { User, UserBankAccount } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { IUserResponse } from "src/domain/interfaces/user/user.interface";
import { UsersRepositoryPort } from "src/domain/repositories/users.repository.port";
import { AddBankAccountDTO } from "../../../domain/dtos/users/add-bank-account.dto";
import { BankRepositoryPort } from "../../../domain/repositories/bank.repository.port";

export class AddBankAccountUseCase {
	constructor(
		@Inject("UserRepository")
		private readonly userRepository: UsersRepositoryPort,
		@Inject("BankRepositoryPort")
		private readonly bankRepository: BankRepositoryPort,
	) {}

	async execute(
		addBankAccountDTO: AddBankAccountDTO,
	): Promise<ApiResponse<UserBankAccount>> {
		const { bankId, accountNumber, userId } = addBankAccountDTO;

		const existedBankAccount = await this.bankRepository.getUniqueBankAccount(
			bankId,
			accountNumber,
			userId,
		);

		if (existedBankAccount) {
			return new ApiResponse<null>(
				HttpStatus.BAD_REQUEST,
				"Bank account already exists",
				null,
			);
		}

		return new ApiResponse<UserBankAccount>(
			HttpStatus.CREATED,
			"Add bank account successful!",
			await this.userRepository.addBankAccount(addBankAccountDTO),
		);
	}
}
