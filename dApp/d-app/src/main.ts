import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinure: false,
    optionSuccessStatus: 204,
    credentials: true,
    allowHeaders: 'Content-Type, Accept, Authorization',
  };
  app.enableCors(corsOptions);
  const config = new DocumentBuilder()
    .setTitle('dApp')
    .setDescription('PI description')
    .setVersion('1.0')
    .addTag('dApp')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
