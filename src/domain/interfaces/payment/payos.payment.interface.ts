import { CheckoutResponseDataType } from "@payos/node/lib/type";

export interface IPayOSPaymentResponse {
	checkoutDataResponse: CheckoutResponseDataType;
	paymentImagePaymentLinkResponse: string;
}