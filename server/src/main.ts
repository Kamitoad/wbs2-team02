import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import * as session from 'express-session';
import {randomBytes} from "crypto";

declare module 'express-session' {
  interface SessionData {
    currentUser?: number;
    role: string;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // CORS aktivieren
    app.enableCors({
      origin: 'http://localhost:4200', // Erlaubt Anfragen von deinem Angular-Frontend
      credentials: true,
    });

    app.setGlobalPrefix('api');

    const secret: string = randomBytes(64).toString('hex')

  app.use(
      session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false,
          maxAge: 86400000,
        },
      }),
  );

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Tik Tak Toe')
    .setDescription('From Team 02 of WBS2')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: '50mb' }));


  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();
