import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	// const response = await fetch("https://api.vietqr.io/v2/banks");
	// const data = await response.json();
	// // console.log(data.data);
	// let banks: Prisma.BankCreateManyInput[] = [];
	// for (let i = 0; i < data.data.length; i++) {
	// 	banks.push({
	// 		name: data.data[i].name,
	// 		code: data.data[i].code,
	// 		shortName: data.data[i].shortName,
	// 		logo: data.data[i].logo
	// 	});
	// }
	// // console.log(banks);
	// const banksAdded = await prisma.bank.createManyAndReturn({
	// 	data: banks
	// });
	const banksGet = await prisma.bank.findMany();
	if (banksGet.length !== 0) return;
	// const response = await fetch("https://api.banklookup.net/api/bank/list");
	const data = {
		data: [
			{
				name: "Ngân hàng TMCP An Bình",
				code: "ABB",
				short_name: "ABBANK",
				logo_url: "https://api.vietqr.io/img/ABB.png"
			},
			{
				name: "Ngân hàng TMCP An Bình",
				code: "ABB",
				short_name: "ABBANK",
				logo_url: "https://api.vietqr.io/img/ABB.png"
			},
			{
				name: "Ngân hàng TMCP Á Châu",
				code: "ACB",
				short_name: "ACB",
				logo_url: "https://api.vietqr.io/img/ACB.png"
			},
			{
				name: "Ngân hàng TMCP Bắc Á",
				code: "BAB",
				short_name: "BacABank",
				logo_url: "https://api.vietqr.io/img/BAB.png"
			},
			{
				name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam",
				code: "BIDV",
				short_name: "BIDV",
				logo_url: "https://api.vietqr.io/img/BIDV.png"
			},
			{
				name: "Ngân hàng TMCP Bảo Việt",
				code: "BVB",
				short_name: "BaoVietBank",
				logo_url: "https://api.vietqr.io/img/BVB.png"
			},
			{
				name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số CAKE by VPBank",
				code: "CAKE",
				short_name: "CAKE",
				logo_url: "https://api.vietqr.io/img/CAKE.png"
			},
			{
				name: "Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam",
				code: "CBB",
				short_name: "CBBank",
				logo_url: "https://api.vietqr.io/img/CBB.png"
			},
			{
				name: "Ngân hàng TNHH MTV CIMB Việt Nam",
				code: "CIMB",
				short_name: "CIMB",
				logo_url: "https://api.vietqr.io/img/CIMB.png"
			},
			{
				name: "Ngân hàng Hợp tác xã Việt Nam",
				code: "COOPB",
				short_name: "Co-op Bank",
				logo_url: "https://api.vietqr.io/img/COOPBANK.png"
			},
			{
				name: "Ngân hàng TNHH MTV Số Vikki",
				code: "DAB",
				short_name: "VikkiBank",
				logo_url: "https://ebanking.vikkibank.vn/khcn/resources/images/common/logo.png"
			},
			{
				name: "DBS Bank Ltd - Chi nhánh Thành phố Hồ Chí Minh",
				code: "DBS",
				short_name: "DBSBank",
				logo_url: "https://api.vietqr.io/img/DBS.png"
			},
			{
				name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam",
				code: "EIB",
				short_name: "Eximbank",
				logo_url: "https://api.vietqr.io/img/EIB.png"
			},
			{
				name: "Ngân hàng Thương mại TNHH MTV Dầu Khí Toàn Cầu",
				code: "GPB",
				short_name: "GPBank",
				logo_url: "https://api.vietqr.io/img/GPB.png"
			},
			{
				name: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh",
				code: "HDB",
				short_name: "HDBank",
				logo_url: "https://api.vietqr.io/img/HDB.png"
			},
			{
				name: "Ngân hàng TNHH MTV Hong Leong Việt Nam",
				code: "HLB",
				short_name: "Hong Leong Bank",
				logo_url: "https://api.vietqr.io/img/HLBVN.png"
			},
			{
				name: "Ngân hàng TNHH MTV HSBC (Việt Nam)",
				code: "HSBC",
				short_name: "HSBC",
				logo_url: "https://api.vietqr.io/img/HSBC.png"
			},
			{
				name: "Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh TP. Hồ Chí Minh",
				code: "IBKHCM",
				short_name: "IBKHCM",
				logo_url: "https://api.vietqr.io/img/IBK.png"
			},
			{
				name: "Ngân hàng Công nghiệp Hàn Quốc - Chi nhánh Hà Nội",
				code: "IBKHN",
				short_name: "IBKHN",
				logo_url: "https://api.vietqr.io/img/IBK.png"
			},
			{
				name: "Ngân hàng TNHH Indovina",
				code: "IVB",
				short_name: "Indovina Bank",
				logo_url: "https://api.vietqr.io/img/IVB.png"
			},
			{
				name: "Ngân hàng Đại chúng TNHH Kasikornbank",
				code: "KB",
				short_name: "Kasikornbank",
				logo_url: "https://api.vietqr.io/img/KBANK.png"
			},
			{
				name: "Ngân hàng Kookmin - Chi nhánh Thành phố Hồ Chí Minh",
				code: "KBKHCM",
				short_name: "KookminHCM",
				logo_url: "https://api.vietqr.io/img/KBHCM.png"
			},
			{
				name: "Ngân hàng Kookmin - Chi nhánh Hà Nội",
				code: "KBKHN",
				short_name: "KookminHN",
				logo_url: "https://api.vietqr.io/img/KBHN.png"
			},
			{
				name: "Ngân hàng TMCP Kiên Long",
				code: "KLB",
				short_name: "KienLongBank",
				logo_url: "https://api.vietqr.io/img/KLB.png"
			},
			{
				name: "Ngân hàng TMCP Lộc Phát Việt Nam",
				code: "LPB",
				short_name: "LPBank",
				logo_url: "https://api.vietqr.io/img/LPB.png"
			},
			{
				name: "Ngân hàng TMCP Quân đội",
				code: "MB",
				short_name: "MBBank",
				logo_url: "https://api.vietqr.io/img/MB.png"
			},
			{
				name: "Ngân hàng TNHH MTV Việt Nam Hiện Đại",
				code: "MBV",
				short_name: "Oceanbank",
				logo_url: "https://mkt-vc.1cdn.vn/2025/03/01/logo-mbv_cafef-600x375.jpg"
			},
			{
				name: "Ngân hàng TMCP Hàng Hải",
				code: "MSB",
				short_name: "MSB",
				logo_url: "https://api.vietqr.io/img/MSB.png"
			},
			{
				name: "Ngân hàng TMCP Nam Á",
				code: "NAB",
				short_name: "NamABank",
				logo_url: "https://api.vietqr.io/img/NAB.png"
			},
			{
				name: "Ngân hàng TMCP Quốc Dân",
				code: "NCB",
				short_name: "NCB",
				logo_url: "https://api.vietqr.io/img/NCB.png"
			},
			{
				name: "Ngân hàng Nonghyup - Chi nhánh Hà Nội",
				code: "NHB",
				short_name: "Nonghyup",
				logo_url: "https://api.vietqr.io/img/NHB.png"
			},
			{
				name: "Ngân hàng TMCP Phương Đông",
				code: "OCB",
				short_name: "OCB",
				logo_url: "https://api.vietqr.io/img/OCB.png"
			},
			{
				name: "Ngân hàng TNHH MTV Public Việt Nam",
				code: "PBVN",
				short_name: "PublicBank",
				logo_url: "https://api.vietqr.io/img/PBVN.png"
			},
			{
				name: "Ngân hàng TMCP Xăng dầu Petrolimex",
				code: "PGB",
				short_name: "PGBank",
				logo_url: "https://api.vietqr.io/img/PGB.png"
			},
			{
				name: "Ngân hàng TMCP Đại Chúng Việt Nam",
				code: "PVCB",
				short_name: "PVcomBank",
				logo_url: "https://api.vietqr.io/img/PVCB.png"
			},
			{
				name: "Ngân hàng TMCP Sài Gòn Thương Tín",
				code: "SCB",
				short_name: "Sacombank",
				logo_url: "https://api.vietqr.io/img/STB.png"
			},
			{
				name: "Ngân hàng TNHH MTV Standard Chartered Bank Việt Nam",
				code: "SCBVN",
				short_name: "Standard Chartered VN",
				logo_url: "https://api.vietqr.io/img/SCVN.png"
			},
			{
				name: "Ngân hàng TMCP Đông Nam Á",
				code: "SEAB",
				short_name: "SeABank",
				logo_url: "https://api.vietqr.io/img/SEAB.png"
			},
			{
				name: "Ngân hàng TMCP Sài Gòn Công Thương",
				code: "SGB",
				short_name: "SaigonBank",
				logo_url: "https://api.vietqr.io/img/SGICB.png"
			},
			{
				name: "Ngân hàng TMCP Sài Gòn",
				code: "SGCB",
				short_name: "SCB",
				logo_url: "https://api.vietqr.io/img/SCB.png"
			},
			{
				name: "Ngân hàng TMCP Sài Gòn - Hà Nội",
				code: "SHB",
				short_name: "SHB",
				logo_url: "https://api.vietqr.io/img/SHB.png"
			},
			{
				name: "Ngân hàng TNHH MTV Shinhan Việt Nam",
				code: "SHBVN",
				short_name: "ShinhanBank",
				logo_url: "https://api.vietqr.io/img/SHBVN.png"
			},
			{
				name: "Công ty Tài chính TNHH Một thành viên Shinhan Việt Nam",
				code: "SHFIN",
				short_name: "Shinhan Finance",
				logo_url: "https://api.jobsnew.vn/public/company/coverImage_e19b9975-b19b-2228-ff4a-efa86c43a7bd_1686103724869-logo-ngang-chu-xanh-khong-nen-_website.webp"
			},
			{
				name: "Ngân hàng TMCP Kỹ thương Việt Nam",
				code: "TCB",
				short_name: "Techcombank",
				logo_url: "https://api.vietqr.io/img/TCB.png"
			},
			{
				name: "Ngân hàng số Timo",
				code: "TIMO",
				short_name: "TIMO",
				logo_url: "https://vietqr.net/portal-service/resources/icons/TIMO.png"
			},
			{
				name: "Ngân hàng TMCP Tiên Phong",
				code: "TPB",
				short_name: "TPBank",
				logo_url: "https://api.vietqr.io/img/TPB.png"
			},
			{
				name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số Ubank by VPBank",
				code: "UB",
				short_name: "Ubank",
				logo_url: "https://api.vietqr.io/img/UBANK.png"
			},
			{
				name: "Ngân hàng United Overseas",
				code: "UOB",
				short_name: "United Overseas Bank",
				logo_url: "https://api.vietqr.io/img/UOB.png"
			},
			{
				name: "Ngân hàng TMCP Việt Á",
				code: "VAB",
				short_name: "VietABank",
				logo_url: "https://api.vietqr.io/img/VAB.png"
			},
			{
				name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
				code: "VARB",
				short_name: "Agribank",
				logo_url: "https://api.vietqr.io/img/VBA.png"
			},
			{
				name: "Ngân hàng TMCP Việt Nam Thương Tín",
				code: "VB",
				short_name: "VietBank",
				logo_url: "https://api.vietqr.io/img/VIETBANK.png"
			},
			{
				name: "Ngân hàng TMCP Ngoại Thương Việt Nam",
				code: "VCB",
				short_name: "Vietcombank",
				logo_url: "https://api.vietqr.io/img/VCB.png"
			},
			{
				name: "Ngân hàng TMCP Bản Việt",
				code: "VCCB",
				short_name: "Ngân hàng Bản Việt",
				logo_url: "https://api.vietqr.io/img/VCCB.png"
			},
			{
				name: "Ngân hàng TMCP Quốc tế Việt Nam",
				code: "VIB",
				short_name: "VIB",
				logo_url: "https://api.vietqr.io/img/VIB.png"
			},
			{
				name: "VNPT Money",
				code: "VNPTMONEY",
				short_name: "VNPTMoney",
				logo_url: "https://api.vietqr.io/img/VNPTMONEY.png"
			},
			{
				name: "Ngân hàng TMCP Việt Nam Thịnh Vượng",
				code: "VPB",
				short_name: "VPBank",
				logo_url: "https://api.vietqr.io/img/VPB.png"
			},
			{
				name: "Ngân hàng Liên doanh Việt - Nga",
				code: "VRB",
				short_name: "VRB",
				logo_url: "https://api.vietqr.io/img/VRB.png"
			},
			{
				name: "Ngân hàng TMCP Công thương Việt Nam",
				code: "VTB",
				short_name: "VietinBank",
				logo_url: "https://api.vietqr.io/img/ICB.png"
			},
			{
				name: "Viettel Money",
				code: "VTLMONEY",
				short_name: "ViettelMoney",
				logo_url: "https://api.vietqr.io/img/VIETTELMONEY.png"
			},
			{
				name: "Ngân hàng TNHH MTV Woori Việt Nam",
				code: "WOO",
				short_name: "Woori",
				logo_url: "https://api.vietqr.io/img/WVN.png"
			}
		]
	}
	// const data = await response.json();
	console.log(data.data);	
	let banks: Prisma.BankCreateManyInput[] = [];
	for (let i = 0; i < data.data.length; i++) {
		banks.push({
			name: data.data[i].name,
			code: data.data[i].code,
			shortName: data.data[i].short_name,
			logo: data.data[i].logo_url
		});
	}
	const banksAdded = await prisma.bank.createManyAndReturn({
			data: banks
		});
}



main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
