
import { ForbiddenException, Injectable, Logger, NestMiddleware, Scope } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { UserService } from "src/user/user.service";
import * as fs from "fs";
import { join } from "path";
const jwt = require('jsonwebtoken');
@Injectable({scope: Scope.REQUEST})
export class AuthenticationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(AuthenticationMiddleware.name);
    constructor (private readonly userService: UserService){}
     async use(req: Request, res: Response, next:NextFunction) {
        this.logger.log(AuthenticationMiddleware.name);
        try {
            const authorizationHeader = req.header('Authorization');
            if(!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
                throw new ForbiddenException('Please Authenticate');
            }
            const token = req.header('Authorization').replace('Bearer ','');
            const privatekey = fs.readFileSync(join(__dirname,'../../keys/Private.key'));
            const { id, role } = jwt.verify(token, privatekey);
            // this.logger.warn(`id and role are ${id} : ${role}`);
            const person = await this.userService.findOne(id);

            if(!person) {
                throw new ForbiddenException('Please Authenticate');
            }
            if(token !== person.authToken) {
                throw new ForbiddenException('Please Authenticate');
            }
            this.userService.setUserObj({id,role});
            next();
        }catch(err) {
            this.logger.error(`Something went wrong while authenticate user: ${err}`);
            next(err);
        }
     }
} 