import { BadmintonParticipantType, Prisma, PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
	await addParticipantForTournamentEvent1();
	await addParticipantForTournamentEvent2();
	await addParticipantForTournamentEvent3();
	await addParticipantForTournamentEvent4();
	await addParticipantForTournamentEvent5();
	await addParticipantForTournamentEvent6();
	await addParticipantIntoTournamentEventSingle();
	await addParticipantIntoTournamentEventDouble();
	await addParticipantForTournamentEvent7();
	await addParticipantForTournamentEvent8();
	await addParticipantForTournamentEvent9();
	await addParticipantForTournamentEvent10();
	await addParticipantForTournamentEvent11();
	await addParticipantForTournamentEvent12();
}

async function addParticipantForTournamentEvent1() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "hcmc-open-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MENS_SINGLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	});
	let tournamentParticipants = [];
	for (const participant of participants) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participant.id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
	// const tournamentEvent2 = await prisma.tournamentEvent.findFirst({
	// 	where: {
	// 		tournamentEvent: "MENS_DOUBLE"
	// 	}
	// });
	// console.log(tournamentEvent2);
	// var participants2 = [];
	// for (let i = 0; i < participants.length; i+=2) {
	// 	const account = await prisma.tournamentParticipants.create({
	// 		data: {
	// 			userId: participants[i].id,
	// 			partnerId: participants[i+1].id,
	// 			tournamentEventId: tournamentEvent2.id,
	// 			tournamentId: tournamentEvent2.tournamentId,
	// 		}
	// 	});
	// 	participants2.push(account);
	// }
}

async function addParticipantForTournamentEvent2() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "hcmc-open-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MENS_DOUBLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 6
	});
	let tournamentParticipants = [];
	for (let i = 0; i < participants.length; i+=2) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: participants[i+1].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId,
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
}

async function addParticipantForTournamentEvent3() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "hcmc-open-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	});
	const femaleParticipants = await prisma.user.findMany({
		where: {
			gender: "FEMALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	}); 
	let tournamentParticipants = [];
	for (let i = 0; i < participants.length; i++) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: femaleParticipants[i].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
}

async function addParticipantForTournamentEvent4() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "da-nang-challenge-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MENS_SINGLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 3,
		take: 3
	});
	let tournamentParticipants = [];
	for (const participant of participants) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participant.id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
	// const tournamentEvent2 = await prisma.tournamentEvent.findFirst({
	// 	where: {
	// 		tournamentEvent: "MENS_DOUBLE"
	// 	}
	// });
	// console.log(tournamentEvent2);
	// var participants2 = [];
	// for (let i = 0; i < participants.length; i+=2) {
	// 	const account = await prisma.tournamentParticipants.create({
	// 		data: {
	// 			userId: participants[i].id,
	// 			partnerId: participants[i+1].id,
	// 			tournamentEventId: tournamentEvent2.id,
	// 			tournamentId: tournamentEvent2.tournamentId,
	// 		}
	// 	});
	// 	participants2.push(account);
	// }
}

async function addParticipantForTournamentEvent5() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "da-nang-challenge-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MENS_DOUBLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 6,
		take: 6
	});
	let tournamentParticipants = [];
	for (let i = 0; i < participants.length; i+=2) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: participants[i+1].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId,
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
}

async function addParticipantForTournamentEvent6() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "da-nang-challenge-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	});
	const femaleParticipants = await prisma.user.findMany({
		where: {
			gender: "FEMALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	}); 
	let tournamentParticipants = [];
	for (let i = 0; i < participants.length; i++) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: femaleParticipants[i].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
}

async function addParticipantIntoTournamentEventSingle() {
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 3,
		take: 17
	});
	console.log(participants.length);
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentEvent: "MENS_SINGLE",
			tournamentId: "hcmc-open-2025"
		}
	});
	for(const participant of participants) {
		const participantAdded = await prisma.tournamentParticipants.create({
			data: {
				userId: participant.id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
	}
}

async function addParticipantIntoTournamentEventDouble() {
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 6,
		take: 34
	});
	console.log(participants.length);
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentEvent: "MENS_DOUBLE",
			tournamentId: "hcmc-open-2025"
		}
	});
	for(let i = 0; i < participants.length; i+=2) {
		const participantAdded = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: participants[i+1].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
	}
}

async function addParticipantForTournamentEvent7() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "da-nang-challenge-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MENS_SINGLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	});
	let tournamentParticipants = [];
	for (const participant of participants) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participant.id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
	// const tournamentEvent2 = await prisma.tournamentEvent.findFirst({
	// 	where: {
	// 		tournamentEvent: "MENS_DOUBLE"
	// 	}
	// });
	// console.log(tournamentEvent2);
	// var participants2 = [];
	// for (let i = 0; i < participants.length; i+=2) {
	// 	const account = await prisma.tournamentParticipants.create({
	// 		data: {
	// 			userId: participants[i].id,
	// 			partnerId: participants[i+1].id,
	// 			tournamentEventId: tournamentEvent2.id,
	// 			tournamentId: tournamentEvent2.tournamentId,
	// 		}
	// 	});
	// 	participants2.push(account);
	// }
}

async function addParticipantForTournamentEvent8() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "da-nang-challenge-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MENS_DOUBLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 6
	});
	let tournamentParticipants = [];
	for (let i = 0; i < participants.length; i+=2) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: participants[i+1].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId,
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
}

async function addParticipantForTournamentEvent9() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "da-nang-challenge-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	});
	const femaleParticipants = await prisma.user.findMany({
		where: {
			gender: "FEMALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	}); 
	let tournamentParticipants = [];
	for (let i = 0; i < participants.length; i++) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: femaleParticipants[i].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
}

async function addParticipantForTournamentEvent10() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "hanoi-masters-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MENS_SINGLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	});
	let tournamentParticipants = [];
	for (const participant of participants) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participant.id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
	// const tournamentEvent2 = await prisma.tournamentEvent.findFirst({
	// 	where: {
	// 		tournamentEvent: "MENS_DOUBLE"
	// 	}
	// });
	// console.log(tournamentEvent2);
	// var participants2 = [];
	// for (let i = 0; i < participants.length; i+=2) {
	// 	const account = await prisma.tournamentParticipants.create({
	// 		data: {
	// 			userId: participants[i].id,
	// 			partnerId: participants[i+1].id,
	// 			tournamentEventId: tournamentEvent2.id,
	// 			tournamentId: tournamentEvent2.tournamentId,
	// 		}
	// 	});
	// 	participants2.push(account);
	// }
}

async function addParticipantForTournamentEvent11() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "hanoi-masters-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MENS_DOUBLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 6
	});
	let tournamentParticipants = [];
	for (let i = 0; i < participants.length; i+=2) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: participants[i+1].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId,
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
	});
}

async function addParticipantForTournamentEvent12() {
	const tournament = await prisma.tournament.findUnique({
		where: {
			id: "hanoi-masters-2025"
		}
	});
	const tournamentEvent = await prisma.tournamentEvent.findFirst({
		where: {
			tournamentId: tournament.id,
			tournamentEvent: BadmintonParticipantType.MIXED_DOUBLE
		}
	});
	const participants = await prisma.user.findMany({
		where: {
			gender: "MALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	});
	const femaleParticipants = await prisma.user.findMany({
		where: {
			gender: "FEMALE",
			email: {
				not: "admin@smashleague.com"
			}
		},
		skip: 0,
		take: 3
	}); 
	let tournamentParticipants = [];
	for (let i = 0; i < participants.length; i++) {
		const account = await prisma.tournamentParticipants.create({
			data: {
				userId: participants[i].id,
				partnerId: femaleParticipants[i].id,
				tournamentEventId: tournamentEvent.id,
				tournamentId: tournamentEvent.tournamentId
			}
		});
		tournamentParticipants.push(account);
	}

	const standing = await prisma.tournamentEvent.update({
		where: {
			id: tournamentEvent.id
		},
		data: {
			championshipId: tournamentParticipants[0].id,
			runnerUpId: tournamentParticipants[1].id,
			thirdPlaceId: tournamentParticipants[2].id
		}
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
