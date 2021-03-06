import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configuration } from './shared/config/config.keys';
import { ConfigModule } from './shared/config/config.module';
import { ConfigService } from './shared/config/config.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule,

    MongooseModule.forRoot(
      new ConfigService().getDatabaseConnection(
        new ConfigService().get(Configuration.NODE_ENV),
      ),
      {
        useFindAndModify: false,
        useCreateIndex: true,
      },
    ),
    UsersModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],

  providers: [AppService, ConfigService, Logger],
})
export class AppModule {
  static port: number | string;
  static env: string;
  constructor(
    private readonly _configService: ConfigService,
    private logger: Logger,
  ) {
    AppModule.port = this._configService.get(Configuration.PORT);
    AppModule.env = this._configService.get(Configuration.NODE_ENV);
    logger.log('[ API REST ] PORT:  ' + AppModule.port);
    logger.log('[ API REST ] ENV:  ' + AppModule.env);
  }
}
