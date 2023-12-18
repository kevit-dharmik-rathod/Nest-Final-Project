import {
  ForbiddenException,
  Injectable,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../modules/user/user.service';
import * as fs from 'fs';
import { join } from 'path';
import { StudentService } from '../modules/student/student.service';
const jwt = require('jsonwebtoken');
@Injectable()
export class UserAuthenticationMiddleware implements NestMiddleware {
  private readonly logger = new Logger(UserAuthenticationMiddleware.name);
  constructor(
    private readonly studentService: StudentService,
    private readonly userService: UserService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(UserAuthenticationMiddleware.name);
    try {
      const headers = req.headers;
      console.log('Headers:', headers);

      const authorizationHeader = req.header('Authorization');
      console.log('authorization header is', authorizationHeader);

      if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
        throw new ForbiddenException('Please Authenticate');
      }
      const token = req.header('Authorization').replace('Bearer ', '');
      console.log('token is ', token);
      // const privatekey = fs.readFileSync(
      //   join(__dirname, '../../keys/Private.key'),
      // );
      //  const {id , role} = jwt.verify(token, privatekey);
      // for testing purpose only

      const { id, role } = jwt.verify(token, process.env.TEST_AUTH_SECRET);
      console.log(`id is ${id} and role is ${role}`);
      const person =
        role === 'STUDENT'
          ? await this.studentService.findOne(id)
          : await this.userService.findOne(id);
      if (!person || token !== person.authToken) {
        throw new ForbiddenException('Please Authenticate');
      }
      if (role === 'STUDENT') {
        this.studentService.setStudentObj({ id, role });
        req['auth'] = { id, role };
      }
      if (role === 'STAFF' || role === 'ADMIN') {
        this.userService.setUserObj({ id, role });
        req['auth'] = { id, role };
      }
      next();
    } catch (err) {
      this.logger.error(
        `error comes from the authentication middleware: ${err}`,
      );
      next(err);
    }
  }
}

//actual code
// import {
//   ForbiddenException,
//   Injectable,
//   Logger,
//   NestMiddleware,
// } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import { UserService } from '../modules/user/user.service';
// import * as fs from 'fs';
// import { join } from 'path';
// import { StudentService } from '../modules/student/student.service';
// const jwt = require('jsonwebtoken');
// @Injectable()
// export class UserAuthenticationMiddleware implements NestMiddleware {
//   private readonly logger = new Logger(UserAuthenticationMiddleware.name);
//   constructor(
//     private readonly studentService: StudentService,
//     private readonly userService: UserService,
//   ) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     this.logger.log(UserAuthenticationMiddleware.name);
//     try {
//       const headers = req.headers;
//       console.log('Headers:', headers);

//       const authorizationHeader = req.header('Authorization');
//       console.log('authorization header is', authorizationHeader);

//       if (!authorizationHeader || !authorizationHeader.startsWith('Bearer')) {
//         throw new ForbiddenException('Please Authenticate');
//       }
//       const token = req.header('Authorization').replace('Bearer ', '');
//
// const privatekey = fs.readFileSync(
//   join(__dirname, '../../keys/Private.key'),
// );
//  const {id , role} = jwt.verify(token, privatekey);
//       const { id, role } = jwt.verify(token, process.env.TEST_AUTH_SECRET);
//       console.log(`id is ${id} and role is ${role}`);
//       const person =
//         role === 'STUDENT'
// ? await this.studentService.findOne(id)
//           : await this.userService.findOne(id);
//       if (!person || token !== person.authToken) {
//         throw new ForbiddenException('Please Authenticate');
//       }
//       if (role === 'STUDENT') {
//         this.studentService.setStudentObj({ id, role });
//         req['auth'] = { id, role };
//       }
//       if (role === 'STAFF' || role === 'ADMIN') {
//         this.userService.setUserObj({ id, role });
//         req['auth'] = { id, role };
//       }
//       next();
//     } catch (err) {
//       this.logger.error(
//         `error comes from the authentication middleware: ${err}`,
//       );
//       next(err);
//     }
//   }
// }
