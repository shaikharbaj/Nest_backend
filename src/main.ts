import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppExceptionFilter } from './exceptions/app.exceptionfilter';
async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });
  const httpAdapter = app.get(HttpAdapterHost);
  // app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AppExceptionFilter(httpAdapter));

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // automatically transforms payloads to DTO instances
    whitelist: true, // strips away unknown properties from payloads
    forbidNonWhitelisted: true, // throws an error if unknown properties are present
    validationError: { // custom error response for validation errors
      target: false,
      value: false,
    },
  }));
  await app.listen(8000);
  logger.log(`Auth server is running on PORT ${8000}`)
}
bootstrap();
