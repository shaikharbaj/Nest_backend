import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    BadRequestException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import * as multer from 'multer';
  import * as express from 'express';
  import { Request } from 'express';
  
  @Injectable()
  export class CustomFilesInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const request = ctx.getRequest<Request>();
  
      return new Observable((observer) => {
        const storage = multer.memoryStorage();
        const upload = multer({ storage }).any();
  
        upload(request, ctx.getResponse(), (err: any) => {
          if (err) {
            observer.error(err);
          } else {
            observer.next();
            observer.complete();
          }
        });
      });
    }
  }
  