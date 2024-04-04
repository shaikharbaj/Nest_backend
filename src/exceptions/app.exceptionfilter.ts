import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
    BadRequestException,
  } from '@nestjs/common';
  import { HttpAdapterHost } from '@nestjs/core';
//   import { RpcException } from '@nestjs/microservices';
  
  @Catch()
  export class AppExceptionFilter implements ExceptionFilter {
    private logger = new Logger(AppExceptionFilter.name);
    constructor(private httpAdapterHost: HttpAdapterHost) {}
    catch(exception: any, host: ArgumentsHost) {
      const { httpAdapter } = this.httpAdapterHost;
      const ctx = host.switchToHttp();
      const request = ctx.getRequest();
      let status = exception.statusCode ? exception.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
      let message = exception?.message ? exception.message : exception;
      if (exception instanceof AggregateError) {
        console.log('AggregateError');
        if (exception.errors.length > 0) {
          message = `${exception.errors[0].code} to port ${exception.errors[0].port}`;
        }
      } else if (exception instanceof HttpException) {
        console.log('HttpException');
        status = exception.getStatus();
        message = exception.message;
      } 
    //   else if (exception instanceof RpcException) {
    //     console.log('RpcException');
    //     message = exception.message;
    //   } 
      else if (exception instanceof BadRequestException) {
        console.log('BadRequestException');
        message = exception.message;
      }
      //logging exception into error log file
      this.logger.log({
        url: request.url,
        level: 'error',
        exception: exception,
      });
      //Generating user understandable response
      const responsePayload = {
        status: 'error',
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
      };
  
      httpAdapter.reply(ctx.getResponse(), responsePayload, status);
    }
  }
  