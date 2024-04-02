/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './modules/app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppConfig } from './core/config/app';
import { SWAGGER_TITLE, SWAGGER_VERSION, SWAGGER_RELATIVE_URL } from './core/shared/constants';
import { TrimWhitespacePipe } from './core/shared/pipes/trim-whitespace.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const {
    server,
    swagger,
    environment,
  } = configService.get<AppConfig>('app');

  const whitelist = [
    // Add whitelists here
  ];

  // Enable localhost on dev/staging servers only
  if (environment === 'development') {
    whitelist.push(/http(s)?:\/\/localhost:/);
  } else {
    app.use(helmet());
  }

  app.enableCors();

  app
    .useGlobalPipes(
      new TrimWhitespacePipe(),
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    .setGlobalPrefix('api/v1');

  if (swagger.enabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(SWAGGER_TITLE)
      .setVersion(SWAGGER_VERSION)
      .addBearerAuth()
      .build();

    const swaggerConfigOptions: SwaggerCustomOptions = {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'method',
        persistAuthorization: true,
        docExpansion: 'none',
      },
    };

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(
      SWAGGER_RELATIVE_URL,
      app,
      document,
      swaggerConfigOptions,
    );
  }

  await app.listen(server.port);

  Logger.log(`Server running on port: ${server.port}`);
}

bootstrap();
