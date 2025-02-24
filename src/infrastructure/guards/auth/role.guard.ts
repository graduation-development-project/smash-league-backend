import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../../decorators/roles.decorator";
import { IRequestUser } from "../../../domain/interfaces/interfaces";
import { Role, RoleMap } from "../../enums/role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const roles: string[] = this.reflector.getAllAndOverride<Role[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		const { user }: IRequestUser = context.switchToHttp().getRequest();

		const roleIds = roles
			.map((roleName) => RoleMap[roleName]?.id)
			.filter(Boolean);

		console.log("roles: ", roles);
		console.log(roleIds);
		console.log("User Roles in Request:", user?.userRoles);
		// @ts-ignore
		return user?.userRoles.some((userRole: string) =>
			roleIds.includes(userRole),
		);
	}
}
