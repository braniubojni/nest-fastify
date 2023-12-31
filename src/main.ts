import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
import { AppModule } from './app.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import fastifyMultipart = require('@fastify/multipart');

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      rawBody: true,
    },
  );
  const PORT = process.env.PORT ?? 5005;

  const config = new DocumentBuilder()
    .setTitle('Fastify w/ Nestjs Project')
    .setDescription('Rest API Documentation')
    .setVersion('1.0.0')
    .addTag('braniubojni')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  /** Middlewares */

  // No need 4 this 4 now. Nest already handling runtime issues related to controller request.
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.useGlobalPipes(new ValidationPipe());
  app.useStaticAssets({
    root: join(__dirname, '..', 'dist', 'static'),
    prefix: '/static/',
  });

  // Multypart
  app.register(fastifyMultipart, {
    addToBody: false,
    attachFieldsToBody: false,
    limits: { fileSize: 1_000_000_000 }, // 1GB
  });
  await app.listen(PORT, () => Logger.debug(`Server at ${PORT}`));
}
bootstrap();
