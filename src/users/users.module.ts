import { Logger, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { SECRET_KEY_TOKEN } from '../shared/static/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: SECRET_KEY_TOKEN,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [UsersService, Logger, AuthService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
