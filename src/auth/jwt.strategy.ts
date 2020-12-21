import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SECRET_KEY_TOKEN, STATUS } from '../shared/static/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET_KEY_TOKEN,
    });
  }

  async validate(payload: any) {
    let userFound = await this.usersService.findOne(payload.userId);
    if (!userFound) return new UnauthorizedException();
    let user = userFound.toJSON();
    if (user.status != STATUS[0]) throw new UnauthorizedException();
    const { password, ...result } = user;
    return result;
  }
}
