import { Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	const roles = await prisma.role.findMany();
	const RoleMap = {
		Admin: { id: null, name: "Admin" },
		Organizer: { id: null, name: "Organizer" },
		Athlete: { id: null, name: "Athlete" },
		Team_Leader: { id: null, name: "Team Leader" },
		Umpire: { id: null, name: "Umpire" },
		Staff: { id: null, name: "Staff" },
	};

	const roleNameMapping = {
		"Team Leader": "Team_Leader",
	};
	
	roles.forEach((role) => {
		const mappedRoleName = roleNameMapping[role.roleName] || role.roleName;
		if (RoleMap[mappedRoleName]) {
			RoleMap[mappedRoleName].id = role.id;
		}
	});

	console.log(RoleMap);

	let accounts : Prisma.UserCreateInput[] = [
			{
				name: "Admin",
				email: "admin@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0123456789",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Trần Ánh Minh",
				email: "trananhminh@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "+84 9122792308",
				isVerified: true,
				gender: "FEMALE"
			},
			{
				name: "Phạm Vĩnh Sơn",
				email: "phamvinhson@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "018238102",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Hồ Dương Trung Nguyên",
				email: "hoduongtrungnguyen@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "7051174663",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Trần Nguyệt Ánh",
				email: "trannguyetanh@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "8886135433",
				isVerified: true,
				gender: "FEMALE"
			},
			{
				name: "Nguyễn Ngọc Nghi",
				email: "nguyenngocnghi@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "1972443218",
				isVerified: true,
				gender: "FEMALE"
			},
			{
				name: "Nguyễn Hoàng Lam",
				email: "nguyenhoanglam@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "2667227290",
				isVerified: true,
				gender: "FEMALE"
			},
			{
				name: "Đỗ Đặng Phúc Anh",
				email: "dodangphucanh@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "7376821154",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Vũ Tùng Linh",
				email: "vutunglinh@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "3584872509",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Nguyễn Bùi Hải Anh",
				email: "nguyenbuihaianh@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "8536919478",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Phạm Hữu Anh Tài",
				email: "phamhuuanhtai@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0808269019",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Trần Đình Thiên Tân",
				email: "trandinhthientan@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "2546213970",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Tống Trần Lê Huy",
				email: "tongtranlehuy@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "4714673332",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Nguyễn Nhật Đức",
				email: "nguyennhatduc@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0100916254",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Nguyễn Thái Trung Kiên",
				email: "nguyenthaitrungkien@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "9674026073",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Nguyễn Trà My",
				email: "nguyentramy@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "5732109235",
				isVerified: true,
				gender: "FEMALE"
			},
			{
				name: "Nguyễn Khánh Linh",
				email: "nguyenkhanhlinh@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "5157185361",
				isVerified: true,
				gender: "FEMALE"
			},
			{
				name: "Võ Quốc Huy",
				email: "voquochuy@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "8847881723",
				isVerified: true,
				gender: "MALE"
			},
			{
				name: "Trần Hoàng Bảo Quyên",
				email: "tranhoangbaoquyen@gmail.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "1071048493",
				isVerified: true,
				gender: "FEMALE"
			},
			{
				name: "Nguyễn Văn An",
				email: "nguyenvanan@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0987654321",
				isVerified: true,
				gender: "MALE",
			},
			{
				name: "Trần Thị Bích Ngọc",
				email: "tranbichngoc@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0912345678",
				isVerified: false,
				gender: "FEMALE",
			},
			{
				name: "Lê Hoàng Minh",
				email: "lehoangminh@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0908765432",
				isVerified: true,
				gender: "MALE",
			},
			{
				name: "Phạm Thùy Linh",
				email: "phamthuylinh@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0981122334",
				isVerified: false,
				gender: "FEMALE",
			},
			{
				name: "Đỗ Quốc Bảo",
				email: "doquocbao@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0977654321",
				isVerified: true,
				gender: "MALE",
			},
			{
				name: "Bùi Thị Cẩm Tiên",
				email: "buicamptien@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0934567890",
				isVerified: false,
				gender: "FEMALE",
			},
			{
				name: "Hoàng Tuấn Kiệt",
				email: "hoangtuanbiet@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0965432109",
				isVerified: true,
				gender: "MALE",
			},
			{
				name: "Võ Hồng Nhung",
				email: "vohongnhung@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0943210987",
				isVerified: false,
				gender: "FEMALE",
			},
			{
				name: "Trịnh Công Thành",
				email: "trinhcongthanh@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0919988776",
				isVerified: true,
				gender: "MALE",
			},
			{
				name: "Dương Thị Mỹ Hạnh",
				email: "duongmyhanh@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0977123456",
				isVerified: false,
				gender: "FEMALE",
			},
			{
				name: "Lý Văn Phúc",
				email: "lyvanphuc@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0922233445",
				isVerified: true,
				gender: "MALE",
			},
			{
				name: "Ngô Minh Châu",
				email: "ngominhchau@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0933344556",
				isVerified: false,
				gender: "FEMALE",
			},
			{
				name: "Đặng Tiến Dũng",
				email: "dangtiendung@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0944455667",
				isVerified: true,
				gender: "MALE",
			},
			{
				name: "Lâm Tấn Phát",
				email: "lamtanphat@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0955566778",
				isVerified: false,
				gender: "MALE",
			},
			{
				name: "Mai Thanh Hằng",
				email: "maithanhhang@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0966677889",
				isVerified: true,
				gender: "FEMALE",
			},
			{
				name: "Hồ Trọng Nhân",
				email: "hotrongnhan@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0977788990",
				isVerified: false,
				gender: "MALE",
			},
			{
				name: "Cao Thị Thu Hà",
				email: "caothithuha@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0988899001",
				isVerified: true,
				gender: "FEMALE",
			},
			{
				name: "Lương Nhật Quang",
				email: "luongnhatquang@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0999900112",
				isVerified: false,
				gender: "MALE",
			},
			{
				name: "Tống Gia Bảo",
				email: "tonggiabao@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0910111213",
				isVerified: true,
				gender: "MALE",
			},
			{
				name: "Vương Thanh Trúc",
				email: "vuongthanhtruc@example.com",
				password: await bcrypt.hash("12345678", 10),
				phoneNumber: "0921222324",
				isVerified: false,
				gender: "FEMALE",
			},
		];
	// accounts.map(async (account) => {
	// 	await prisma.user.create({
	// 		data: account
	// 	});
	// })	
	await accounts.forEach(async (account) => {
		const accountCreate = await prisma.user.create({
			data: account
		});
		if (accountCreate.name === "Admin") {
			const userRole = await prisma.userRole.create({
				data: {
					userId: accountCreate.id,
					roleId: RoleMap["Admin"].id
				}
			});
		}
		const userRole = await prisma.userRole.create({
			data: {
				userId: accountCreate.id,
				roleId: RoleMap["Athlete"].id
			}
		});
		console.log(userRole);
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