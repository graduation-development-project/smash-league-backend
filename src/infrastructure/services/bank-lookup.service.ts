import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { ICheckBankAccountRequest, ICheckBankAccountResponse } from "src/domain/interfaces/bank/bank-account.interface";

@Injectable()
export class BankLookUpService {
	private apiKey: string;
	private apiSecret: string;
	constructor(
		private readonly configService: ConfigService,
	) {
		this.apiKey = this.configService.get<string>("BANK_LOOKUP_API_KEY");
		this.apiSecret = this.configService.get<string>("BANK_LOOKUP_API_SECRET");
	}

	async bankLookUpAccount(checkBankAccountRequest: ICheckBankAccountRequest): Promise<ICheckBankAccountResponse>{
		let result;
		const checkBankAccountResponse = await axios.post("https://api.banklookup.net/api/bank/id-lookup-prod", 
			{
				...checkBankAccountRequest
			},
			{
				headers: {
					"x-api-key": this.apiKey,
					"x-api-secret": this.apiSecret
				}
			}
		).then((response) => {
			result = response.data;
		}).catch((e) => {
			result = e.response.data;
		});
		return result;
	} 
}