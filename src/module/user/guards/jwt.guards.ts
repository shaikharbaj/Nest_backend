import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { Request } from "express";
import * as jwt from 'jsonwebtoken'

@Injectable()
export class JwtGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {


        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException();

        try {
            const payload = await jwt.verify(token, "ARBAJ");
            console.log(payload);
            request.user = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;

    }

    private extractTokenFromHeader(request: Request) {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === 'Bearer' ? token : undefined
    }
}