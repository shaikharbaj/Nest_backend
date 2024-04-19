import { CanActivate, ExecutionContext, ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const roles = this.reflector.get<string[]>('roles', context.getHandler())

    const { user } = context.switchToHttp().getRequest();
    if(roles && roles.includes(user?.role)){
        return true;
    }
    throw new ForbiddenException({
      status: HttpStatus.FORBIDDEN,
      success: false,
      message: 'You dont have required permission to perform this action.',
    });
  }
}
