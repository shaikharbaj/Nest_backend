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
  constructor(private httpAdapterHost: HttpAdapterHost) { }
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    let status = exception.statusCode ? exception.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception?.message ? exception.message : exception;
    let validationerror: any;

    const responsePayload: any = {
      status: 'error',
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    };


    if (exception instanceof AggregateError) {
      console.log('AggregateError');
      if (exception.errors.length > 0) {
        message = `${exception.errors[0].code} to port ${exception.errors[0].port}`;
      }
    } else if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      const response = exception.getResponse() as { message: string[] };
      if (response && Array.isArray(response.message)) {
        message = 'Validation failed' // Access validation errors directly from 'message' array
        validationerror = this.formatValidationErrors(response.message); // Access validation errors directly from 'message' array
      } else {
        message = 'Validation failed';
      }
    } else if (exception instanceof HttpException) {
      console.log('httpexception')
      status = exception.getStatus();
      message = exception.message || 'Unspecified Error';
    }
    //logging exception into error log file
    this.logger.log({
      url: request.url,
      level: 'error',
      exception: exception,
    });
    //Generating user understandable response

    if (validationerror) {
      responsePayload.validationerror = validationerror;
    }
    httpAdapter.reply(ctx.getResponse(), responsePayload, status);
  }
  private formatValidationErrors(errors: string[] | undefined): Record<string, string> {
    if (!errors) {
      return {};
    }

    const errorObject: Record<string, string> = {};

    errors.forEach(error => {
      const [fieldName, ...errorMessageParts] = error.split(' '); // Splitting error string by space
      const errorMessage = errorMessageParts.join(' '); // Joining the remaining parts to get the error message
      errorObject[fieldName.replace(':', '')] = errorMessage; // Removing colon from field name and assigning error message
    });

    return errorObject;
  }
}
