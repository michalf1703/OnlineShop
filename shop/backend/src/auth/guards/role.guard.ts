import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from 'src/user/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRole = this.reflector.get<Role>(
            'required-role',
            context.getHandler()
        );

        if (!requiredRole) {
            return true;
        }

        const req = context.switchToHttp().getRequest();
        const user = req.user;
        return user.role === requiredRole;
    }
}
