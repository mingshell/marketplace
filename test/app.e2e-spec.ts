import { Test, TestingModule } from '@nestjs/testing';
import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
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
  let tokenUser = '';
  let userId = '';

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
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', async () => {
    var res = await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');

    return res;
  });
  describe('MODULO USUARIOS', () => {
    let baseEmail = Array(7)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(36))
      .join('')
      .toString()
      .toLowerCase();

    it('crea usuario y retorna jwt ', async () => {
      let user = {
        user: baseEmail + '@gmail.com',
        password: '123456',
      };
      let res = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(201);
      tokenUser = res.body.data.jwt;
      userId = res.body.data.id;
      expect(String(res.body.data.jwt).length <= 0);

      return res;
    });
    it('Valida que el usuario no exista ', async () => {
      let user = {
        user: baseEmail + '@gmail.com',
        password: '123456',
      };
      let res = await request(app.getHttpServer())
        .post('/users')
        .send(user)
        .expect(409);

      return res;
    });
  });

  describe('MADULO DE PRODUCTOS', () => {
    let SKU = Array(5)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(36))
      .join('')
      .toString()
      .toUpperCase();
    let nameProduct = Array(5)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(36))
      .join('')
      .toString()
      .toUpperCase();

    it('crea producto ', async () => {
      let newProduct = {
        sellerId: userId,
        title: nameProduct,
        sku: SKU,
        price: 100,
        quantity: 5,
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', 'Bearer ' + tokenUser)
        .send(newProduct)
        .expect(HttpStatus.CREATED);

      return res;
    });

    it('valida que el usuario este autentificado para crear producto ', async () => {
      let newProduct = {
        sellerId: userId,
        title: nameProduct,
        sku: SKU,
        price: 100,
        quantity: 5,
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .send(newProduct)
        .expect(HttpStatus.UNAUTHORIZED);

      return res;
    });

    it('Valida que el titulo no este vacio ', async () => {
      let newProduct = {
        sellerId: userId,
        title: '',
        sku: SKU + '89',
        price: 100,
        quantity: 5,
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', 'Bearer ' + tokenUser)
        .send(newProduct)
        .expect(HttpStatus.BAD_REQUEST);
      console.log(res.error);
      return res;
    });

    it('Valida que el sku no este vacio ', async () => {
      let newProduct = {
        sellerId: userId,
        title: nameProduct,
        sku: '',
        price: 100,
        quantity: 5,
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', 'Bearer ' + tokenUser)
        .send(newProduct)
        .expect(HttpStatus.BAD_REQUEST);

      return res;
    });
    it('Valida que el sku  este definido ', async () => {
      let newProduct = {
        sellerId: userId,
        title: nameProduct,
        price: 100,
        quantity: 5,
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', 'Bearer ' + tokenUser)
        .send(newProduct)
        .expect(HttpStatus.BAD_REQUEST);

      return res;
    });
    it('Valida que el price se numero ', async () => {
      let newProduct = {
        sellerId: userId,
        title: nameProduct,
        sku: SKU,
        price: '',
        quantity: 5,
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', 'Bearer ' + tokenUser)
        .send(newProduct)
        .expect(HttpStatus.BAD_REQUEST);

      return res;
    });
    it('Valida que el price este definido ', async () => {
      let newProduct = {
        sellerId: userId,
        title: nameProduct,
        sku: SKU,
        quantity: 5,
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', 'Bearer ' + tokenUser)
        .send(newProduct)
        .expect(HttpStatus.BAD_REQUEST);

      return res;
    });
    it('Valida que el quantity se numero ', async () => {
      let newProduct = {
        sellerId: userId,
        title: nameProduct,
        sku: SKU,
        price: 100,
        quantity: '',
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', 'Bearer ' + tokenUser)
        .send(newProduct)
        .expect(HttpStatus.BAD_REQUEST);

      return res;
    });
    it('Valida que el quantity este definido ', async () => {
      let newProduct = {
        sellerId: userId,
        title: nameProduct,
        sku: SKU,
        price: 100,
      };
      let res = await request(app.getHttpServer())
        .post('/products')
        .set('Authorization', 'Bearer ' + tokenUser)
        .send(newProduct)
        .expect(HttpStatus.BAD_REQUEST);

      return res;
    });
  });
});
