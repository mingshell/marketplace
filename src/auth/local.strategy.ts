import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dtos/credentials.dto';
import { STATUS } from 'src/shared/static/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService, private logger: Logger) {
    super();
  }
  async validate(username: string, password: string): Promise<any> {
    this.logger.log('[Auth] Authenticate by credentials');

    const userRes = await this.authService.validateUser(username, password);
    console.log(userRes);
    if (!userRes) throw new UnauthorizedException();
    if (userRes.status != STATUS[0]) throw new UnauthorizedException();
    return userRes;
  }
}
