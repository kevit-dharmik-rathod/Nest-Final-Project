import { Injectable, Dependencies, ExecutionContext, Scope, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../modules/user/user.service';

@Injectable()
@Dependencies(Reflector)
export class RolesGuard {
    private logger = new Logger(RolesGuard.name);
    constructor(private reflector: Reflector, private userService: UserService) { }

    canActivate(context: ExecutionContext): Boolean {
        try {
            const roles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log(roles);
        if (!roles) {
            console.log("enter in to if condition");
            return true;
        }
        const request = context.switchToHttp().getRequest();
        console.log(request['auth']['role']);
        const result = roles.includes(request['auth']['role'])
        console.log(result );
        return roles.includes(request['auth']['role']);
        } catch(error) {
            console.log(`error thrown from the guard: ${error}`);
            throw error;
        }
        
    }
}
