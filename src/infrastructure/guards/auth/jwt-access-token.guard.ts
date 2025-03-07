import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard("jwt") {
	handleRequest(err, user, info) {
    if (err || !user) {
      throw new UnauthorizedException({
        success: false,
        statusCode: 401,
        error: 'Unauthorized',
        message: 'You are not authenticated. Please log in with a valid token.',
        timestamp: new Date().toISOString(),
      });
    }
    return user;
  }
}
