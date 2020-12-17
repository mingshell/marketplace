import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    let userFound = await this.usersService.findByUser(username);
    if (!userFound) return null;
    const user = userFound.toJSON();
    if (await bcrypt.compare(pass, await user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      user: user.user,
      userId: user._id,
      status: user.status,
      rol: user.rol,
    };
    return { jwt: this.jwtService.sign(payload) };
  }
}
