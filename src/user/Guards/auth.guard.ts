import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { ExecutionContext } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";

export class AuthGuard implements CanActivate {
    canActivate(ctx: ExecutionContext) : boolean {
        const request = ctx.switchToHttp().getRequest()
        if(request.user) {
            return true;
        }

        throw new HttpException('Not Authorized',HttpStatus.UNAUTHORIZED)
    }
}