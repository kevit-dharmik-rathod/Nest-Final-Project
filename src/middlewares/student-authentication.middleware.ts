
import { ForbiddenException, Injectable, Logger, NestMiddleware, Scope } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import * as fs from "fs";
import { join } from "path";
import { StudentService } from "src/modules/student/student.service";
const jwt = require('jsonwebtoken');
@Injectable()
export class StudentAuthenticationMiddleware implements NestMiddleware {
    private readonly logger = new Logger(StudentAuthenticationMiddleware.name);
    constructor(private readonly studentService: StudentService) { }
    async use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(StudentAuthenticationMiddleware.name);
        try {
            const authorizationHeader = req.header('Authorization');
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
                throw new ForbiddenException('Please Authenticate');
            }
            const token = req.header('Authorization').replace('Bearer ', '');
            const privatekey = fs.readFileSync(join(__dirname, '../../keys/Private.key'));
            const { id, role } = jwt.verify(token, privatekey);
            const person = await this.studentService.findOne(id);

            if (!person) {
                throw new ForbiddenException('Please Authenticate');
            }
            if (token !== person.authToken) {
                throw new ForbiddenException('Please Authenticate');
            }
            this.studentService.setStudentObj({ id, role });
            req['auth'] = { id, role };

            next();
        } catch (err) {
            this.logger.error(`${err}`);
            next(err);
        }
    }
} 