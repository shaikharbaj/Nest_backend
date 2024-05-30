import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.getAllAndOverride<any>(
      'permission',
      [context.getHandler(), context.getClass()],
    );

    console.log(requiredPermission);
    if (!requiredPermission) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(user);
    const allowedPermissions = user?.permission;
    console.log(allowedPermissions);
    if (
      allowedPermissions &&
      allowedPermissions.length > 0 &&
      allowedPermissions.includes(requiredPermission)
    ) {
      return true;
    }
    throw new ForbiddenException({
      status: HttpStatus.FORBIDDEN,
      success: false,
      message: 'You dont have required permission to perform this action.',
    });
  }
}
