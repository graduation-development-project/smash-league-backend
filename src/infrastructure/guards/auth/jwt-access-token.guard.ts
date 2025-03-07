import { ExecutionContext, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";
import { UnauthenticatedUnauthorizationErrorResponse } from "src/domain/dtos/unauthenticated-error.response";

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard("jwt") {
	handleRequest(error, user, info) {
    if (error || !user) {
      throw new UnauthorizedException(new UnauthenticatedUnauthorizationErrorResponse<string>(
				HttpStatus.UNAUTHORIZED,
				"You don't have permission to use this API!",
				null
			));
    }
    return user;
  }
}
