export class AuthenticationResponse {
	accessToken: string;
	refreshToken: string;
	email: string;
	name: string;
	id: string;
	roles: string[];

	constructor(accessToken: string, refreshToken: string, email: string, name: string, 
							id: string, roles: string[]
	) {
		this.accessToken = accessToken;
		this. refreshToken = refreshToken;
		this.email = email;
		this.name = name;
		this.id = id;
		this.roles = roles;
	}
}