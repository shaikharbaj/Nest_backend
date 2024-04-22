import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    console.log(requiredRoles)
    if (!requiredRoles || requiredRoles.length === 0) {
      // No roles specified for this endpoint, so allow access
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role || user.role.length === 0) {
      // User is not authenticated or has no roles, so deny access
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        success: false,
        message: 'You are not authorized to access this resource.',
      });
    }

    // Extract role names from user's roles array
    const userRoleNames = user.role.map((role) => role.role.name);
    console.log(userRoleNames)

    // Check if any of the user's role names match the required roles for the endpoint
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoleNames.includes(role),
    );
    if (!hasRequiredRole) {
      // User does not have any of the required roles, so deny access
      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        success: false,
        message:
          'You do not have the required permission to perform this action.',
      });
    }
    // User has at least one of the required roles, so allow access
    return true;
  }
}
