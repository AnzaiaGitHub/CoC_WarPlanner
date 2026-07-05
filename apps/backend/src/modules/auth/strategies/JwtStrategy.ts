import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/modules/users/users.service";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JWT_Payload } from "../types/JWT-Payload";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { AppConfigService } from "src/config/app-config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // Implement your JWT strategy logic here
  constructor(
    readonly usersService: UsersService,
    readonly appConfigService: AppConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.accessTokenSecret,
    });
  }

  validate(payload: JWT_Payload) : AuthenticatedUser {
    const user = this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      activeAccount: user.activeAccount,
    };
  }
}