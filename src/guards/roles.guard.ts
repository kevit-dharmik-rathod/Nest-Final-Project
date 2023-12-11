import { Injectable, Dependencies, ExecutionContext, Scope, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../modules/user/user.service';

@Injectable()
@Dependencies(Reflector)
export class RolesGuard {
    private logger = new Logger(RolesGuard.name);
    constructor(private reflector: Reflector, private userService: UserService) { }

    canActivate(context: ExecutionContext): Boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        return roles.includes(request['auth']['role']);
    }
}
