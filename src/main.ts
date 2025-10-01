import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loggerGlobal } from './middlewares/logger.middleware';
import { AuthGuard } from './guards/auth.guard';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { auth } from 'express-openid-connect';
import {config as auth0Config} from './config/auth0.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// npm install express-openid-connect
// npm install --save @nestjs/swagger  


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //app.useGlobalGuards(new AuthGuard());
  //app.useGlobalInterceptors(new MyInterceptor());
  app.use(auth(auth0Config))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      exceptionFactory: (errors) => {
        const cleanErrors = errors.map((error) => {
          return {property: error.property, constraints: error.constraints};
        })
        return new BadRequestException({
          alert: "se han detectado los siguientes errores en la peticion, y te mandamos este mensaje personalizado",
          errors: cleanErrors,
        });
      }
  }));
  app.use(loggerGlobal);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo Nest')
    .setDescription('Esta es una API contruida con Nest para ser empleada en las demos del M4 backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);

}

bootstrap();




