import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SECRET_KEY_TOKEN, STATUS } from 'src/shared/static/constants';

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
    let user = await this.usersService.findOne(payload.userId);
    if (!user) return new UnauthorizedException();
    if (user.status != STATUS.active.toString())
      throw new UnauthorizedException();
    return { ...user };
  }
}
