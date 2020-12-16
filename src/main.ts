import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  console.log('Sever running: http://127.0.0.1:' + AppModule.port);
  await app.listen(AppModule.port);
}
bootstrap();
