import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from '../src/shared/config/config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '../src/shared/config/config.service';
import { Configuration } from '../src/shared/config/config.keys';
import { UsersModule } from '../src/users/users.module';
import { AuthModule } from '../src/auth/auth.module';
import { ProductsModule } from '../src/products/products.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let logger: Logger;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
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
      providers: [Logger],
    }).compile();

    logger = moduleFixture.get<Logger>(Logger);
    app = moduleFixture.createNestApplication();

    await app.init();
  });

  it('/ (GET)', async () => {
    var res = await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
    app.close();
    return res;
  });
  describe('MODULO Ususarios', () => {
    let baseEmail = Array(7)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(36))
      .join('')
      .toString()
      .toLowerCase();

    it('crear usuario ', async () => {
      let user = {
        user: baseEmail + '@gmail.com',
        password: '123456',
      };
      let res = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201);
      app.close();
      return res;
    });
    it('Valida que el usuario ya exista ', async () => {
      let user = {
        user: baseEmail + '@gmail.com',
        password: '123456',
      };
      let res = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(409);
      app.close();
      return res;
    });
  });
});
