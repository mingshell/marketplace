import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Configuration } from '../shared/config/config.keys';
import { ConfigService } from '../shared/config/config.service';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { INestApplication } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let app: INestApplication;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        MongooseModule.forRoot(
          new ConfigService().getDatabaseConnection(
            new ConfigService().get(Configuration.NODE_ENV),
          ),
          {
            useFindAndModify: false,
            useCreateIndex: true,
          },
        ),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    app = module.createNestApplication();
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('UsersController is defined', async () => {
    await expect(controller).toBeDefined();
  });
  describe('Request POST', () => {
    it('user already exist ', () => {
      let user= {
         "user": "pedro@gmail.com",
         "password": "123456"
       }
      // let res = request(app.getHttpServer())
      //   .post('http://127.0.0.1:3000/api/users')
      //   .send(user) 
      //   .expect(200);
      return true; 
    });
  });
});
