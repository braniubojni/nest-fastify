import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      // logger: true
    }),
  );
  const PORT = process.env.PORT ?? 5005;

  // Middlewares
  // No need 4 this 4 now. Nest already handling runtime issues related to controller request.
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  await app.listen(PORT, () => Logger.debug(`Server at ${PORT}`));
}
bootstrap();
