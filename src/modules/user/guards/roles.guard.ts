import { Injectable, Dependencies, ExecutionContext, Scope, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user.service';

@Injectable()
@Dependencies(Reflector)
export class RolesGuard {
    private logger = new Logger(RolesGuard.name);
    constructor(private reflector: Reflector, private userService: UserService) { }

    canActivate(context: ExecutionContext): Boolean {
        this.logger.log('logged in to the rolesguard');
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        // console.log('roles are ',roles);
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        console.log("req['auth'] in guard" ,request['auth']['role']);
        return roles.includes(request['auth']['role']);
    }
}
