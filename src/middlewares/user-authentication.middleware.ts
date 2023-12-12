
import { ForbiddenException, Injectable, Logger, NestMiddleware, Scope } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { UserService } from "../modules/user/user.service";
import * as fs from "fs";
import { join } from "path";
import { StudentService } from "src/modules/student/student.service";
const jwt = require('jsonwebtoken');
@Injectable()
export class UserAuthenticationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(UserAuthenticationMiddleware.name);
    constructor(private readonly studentService: StudentService, private readonly userService: UserService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(UserAuthenticationMiddleware.name);
        try {
            const authorizationHeader = req.header('Authorization');
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
                throw new ForbiddenException('Please Authenticate');
            }
            const token = req.header('Authorization').replace('Bearer ', '');
            const privatekey = fs.readFileSync(join(__dirname, '../../keys/Private.key'));
            const { id, role } = jwt.verify(token, privatekey);
            const person = role === 'STUDENT' ? await this.studentService.findOne(id) : await this.userService.findOne(id);
            if (!person || token !== person.authToken) {
                throw new ForbiddenException('Please Authenticate');
            }
            if (role === 'STUDENT') {
                this.studentService.setStudentObj({ id, role });
                req['auth'] = { id, role };
            }
            if (role === "STAFF" || role === "ADMIN") {
                this.userService.setUserObj({ id, role });
                req['auth'] = { id, role };
            }
            next();
        } catch (err) {
            this.logger.error(`error comes from the authentication middleware: ${err}`);
            next(err);
        }
    }
} 