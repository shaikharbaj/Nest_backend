import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
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
  // await app.register(multipart, {
  //   throwFileSizeLimit: true,
  //   limits: {
  //     fileSize: 1 * 1024 * 1024,
  //   },
  // });
  await app.listen(8000);
  logger.log(`Auth server is running on PORT ${8000}`)
}
bootstrap();
