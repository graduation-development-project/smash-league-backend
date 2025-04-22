import { UpdateTournamentEventsDTO } from './../../../domain/interfaces/tournament/tournament.validation';
import { TournamentRepositoryPort } from './../../../domain/repositories/tournament.repository.port';
import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { BadmintonParticipantType, TournamentEvent, TournamentStatus } from "@prisma/client";
import { ApiResponse } from "src/domain/dtos/api-response";
import { UpdateTournamentEventDTO } from 'src/domain/interfaces/tournament/tournament.validation';
import { TournamentEventRepositoryPort } from 'src/domain/repositories/tournament-event.repository.port';
@Injectable()
export class UpdateTournamentEventInformationUseCase {
	constructor(
		@Inject("TournamentRepository")
		private readonly tournamentRepository: TournamentRepositoryPort,
		@Inject("TournamentEventRepository")
		private readonly tournamentEventRepository: TournamentEventRepositoryPort
	) {
	} 

	async execute(tournamentId: string, updateTournamentEvent: UpdateTournamentEventsDTO): Promise<ApiResponse<TournamentEvent[]>> {
		// const tournament = await this.tournamentRepository.getTournament(tournamentId);
		// if (tournament.status !== TournamentStatus.CREATED) return new ApiResponse<null | undefined>(
		// 	HttpStatus.BAD_REQUEST,
		// 	"Tournament needs to be in CREATED status to update event information",
		// 	null
		// );
		console.log(tournamentId);
		const transformedData = this.transformTournamentEvents(updateTournamentEvent, tournamentId);
		const tournamentEventsToAdd = this.filterTournamentEventsToAdd(transformedData);
		const tournamentEventsToUpdate = this.filterTournamentEventsToUpdate(transformedData);
		console.log(tournamentEventsToAdd.length);
		if (tournamentEventsToAdd.length > 0) {
			const tournamentEventsAdded = await this.tournamentEventRepository.createMultipleTournamentEvent(tournamentEventsToAdd, tournamentId);
		}
		console.log(tournamentEventsToUpdate.length);
		if (tournamentEventsToUpdate.length > 0) {
			const tournamentEventUpdated = await this.tournamentEventRepository.updateManyTournamentEvent(tournamentEventsToUpdate);
		}
		
		// const tournamentEventForAdds = this.filterTournamentEventsToAdd(transformedData);
		return new ApiResponse<TournamentEvent[]>(
			HttpStatus.NO_CONTENT,
			"Updated tournament event information successfully",
			[
				...tournamentEventsToAdd,
				...tournamentEventsToUpdate,
			]
		);
	}

	filterTournamentEventsToAdd(data: UpdateTournamentEventDTO[]): any[] { 
		const filteredData = data.filter((item) => item.id === null || item.id === undefined);
		return filteredData;
	}

	filterTournamentEventsToUpdate(data: UpdateTournamentEventDTO[]): any[] {
		const filteredData = data.filter((item) => item.id !== null && item.id !== undefined);
		return filteredData;
	}


	async addNewTournamentEvent(tournamentEvents: TournamentEvent[]): Promise<any> {
		return;
	}

	transformTournamentEvents = (data: any, tournamentId: string): any[] => {
			const tournamentEvents: any[] = [];	
			data.updateTournamentEvent.forEach((event: any) => {
				for (const eventType in event) {
					if (eventType !== "tournamentId") {
						if (Array.isArray(event[eventType])) {
							event[eventType].forEach((item: any) => {
								if (item) {
									let tournamentEventEnum: BadmintonParticipantType;
									switch (eventType) {
										case "MENS_SINGLE":
											tournamentEventEnum = BadmintonParticipantType.MENS_SINGLE;
											break;
										case "WOMENS_SINGLE":
											tournamentEventEnum =
												BadmintonParticipantType.WOMENS_SINGLE;
											break;
	
										case "MENS_DOUBLE":
											tournamentEventEnum = BadmintonParticipantType.MENS_DOUBLE;
											break;
	
										case "WOMENS_DOUBLE":
											tournamentEventEnum =
												BadmintonParticipantType.WOMENS_DOUBLE;
											break;
	
										case "MIXED_DOUBLE":
											tournamentEventEnum = BadmintonParticipantType.MIXED_DOUBLE;
											break;
										default:
											console.error(`Invalid eventType: ${eventType}`);
											return [];
									}
	
									tournamentEvents.push({
										id: item.id,
										tournamentId: tournamentId,
										tournamentEvent: eventType as BadmintonParticipantType,
										fromAge: item.fromAge,
										toAge: item.toAge,
										winningPoint: item.winningPoint,
										lastPoint: item.lastPoint,
										numberOfGames: parseInt(item.numberOfGames, 10),
										typeOfFormat: item.typeOfFormat,
										ruleOfEventExtension: item.ruleOfEventExtension,
										minimumAthlete: item.minimumAthlete,
										maximumAthlete: item.maximumAthlete,
										championshipPrize: item.championshipPrize,
										runnerUpPrize: item.runnerUpPrize,
										thirdPlacePrize: item.thirdPlacePrize,
										jointThirdPlacePrize: item.jointThirdPlacePrize,
									});
								}
							});
						}
					}
				}
			});	
			return tournamentEvents;
		};
}