import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FormDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.body && request.body.variants) {
      // Process the variants array and set the field names accordingly
      const variants = request.body.variants;
      variants.forEach((variant: any, variantIndex: number) => {
        variant.attributes.forEach((attribute: any, attributeIndex: number) => {
          const field = `variants[${variantIndex}][attributes][${attributeIndex}][attributeValueId]`;
          request.body[field] = attribute.attributeValueId;
        });
      });
    }
    return next.handle();
  }
}
