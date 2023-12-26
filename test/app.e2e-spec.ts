import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserService } from '../src/modules/user/user.service';
import { DepartmentService } from '../src/modules/department/department.service';
import {
  Department,
  departmentSchema,
} from '../src/modules/department/Schemas/dept.schema';
import { User, userSchema } from '../src/modules/user/Schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import {
  Attendance,
  attendanceSchema,
} from '../src/modules/attendance/Schemas/attendance.schema';
import {
  Student,
  studentSchema,
} from '../src/modules/student/Schemas/student.schema';
import { AppModule } from '../src/app.module';
import { AttendanceService } from '../src/modules/attendance/attendance.service';
import { StudentService } from '../src/modules/student/student.service';
import {
  Admin,
  depOne,
  depTwo,
  staffOne,
  staffTwo,
} from '../testStubs/testing.stubs';
import { Model, Types } from 'mongoose';
import { CreateAttendanceDto } from 'src/modules/attendance/dtos/create-attendance.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userModel: Model<User>;
  let userService: UserService;
  let studentService: StudentService;
  let studentModel: Model<Student>;
  let attendanceModel: Model<Attendance>;
  let departmentModel: Model<Department>;
  let attendanceService: AttendanceService;
  let departmentService: DepartmentService;
  let token: string;
  let department: Department;
  let user: User;
  let stId1: string;
  let atId1: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://0.0.0.0:27017/', {
          dbName: 'NEST-COLLEGE-ERP-TEST',
        }),
        MongooseModule.forFeature([
          { name: 'User', schema: userSchema },
          { name: 'Department', schema: departmentSchema },
          { name: 'Attendance', schema: attendanceSchema },
          { name: 'Student', schema: studentSchema },
        ]),
        AppModule,
      ],
      providers: [
        UserService,
        DepartmentService,
        AttendanceService,
        StudentService,
      ],
    }).compile();
    userService = moduleFixture.get<UserService>(UserService);
    departmentService = moduleFixture.get<DepartmentService>(DepartmentService);
    attendanceService = moduleFixture.get<AttendanceService>(AttendanceService);
    userModel = moduleFixture.get<Model<User>>(getModelToken('User'));
    attendanceModel = moduleFixture.get<Model<Attendance>>(getModelToken('Attendance'));
    studentService = moduleFixture.get<StudentService>(StudentService);
    studentModel = moduleFixture.get<Model<Student>>(getModelToken('Student'));
    departmentModel = moduleFixture.get<Model<Department>>(
      getModelToken('Department'),
    );

    //whenever starting test then first we have to create below admin after that we have able to grab id and then we can set the token for the same
    // await userService.create(Admin);
    await userService.clearUser();
    await studentService.clearStudents();
    await departmentService.clearDepartment();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('login in route for admin ', () => {
    it('post router for admin login', async () => {
      const user = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'brook@gmail.com',
          password: '123',
        })
        .expect(200);
    });
  });
  describe('add  user', () => {
    it('should add new staff member ', async () => {
      const temp = await userModel.findOne({ email: 'brook@gmail.com' });
      token = temp.authToken;
      await request(app.getHttpServer())
        .post('/user/add')
        .send(staffOne)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });
  });
  describe('add  user', () => {
    it('should add new staff member ', async () => {
      await request(app.getHttpServer())
        .post('/user/add')
        .send(staffTwo)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });
  });

  //----------------------------------------------------starting Department integration testing----------------------------------------------------//

  describe('add department', () => {
    it('should create a new department', async () => {
      await request(app.getHttpServer())
        .post('/department/add')
        .send(depOne)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });
  });
  describe('add department', () => {
    it('should create a new department', async () => {
      await request(app.getHttpServer())
        .post('/department/add')
        .send(depTwo)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });
  });
  describe('get all department', () => {
    it('should return all department and also get department by it"s id', async () => {
      const result = await request(app.getHttpServer())
        .get('/department/getall')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('get department by id', () => {
    it('should return department', async () => {
      const result = await request(app.getHttpServer())
        .get('/department/getall')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const dep = await request(app.getHttpServer())
        .get(`/department/${result.body[0]._id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  //----------------------------------------------------starting Student integration testing----------------------------------------------------//

  describe('add student by admin ', () => {
    it('should be able to add a student', async () => {
      const result = await request(app.getHttpServer())
        .get('/department/getall')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const student = await request(app.getHttpServer())
        .post('/student/add')
        .send({
          name: 'jeet',
          email: 'jeet@gmail.com',
          mobileNumber: 5152456789,
          password: 'jeet12',
          department: result.body[0]._id,
          sem: 5,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
    });
  });
  describe('add another student by admin ', () => {
    it('should be able to add a student', async () => {
      const result = await request(app.getHttpServer())
        .get('/department/getall')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const student = await request(app.getHttpServer())
        .post('/student/add')
        .send({
          name: 'tarang',
          email: 'tarang@gmail.com',
          mobileNumber: 5152456789,
          password: 'tarang12',
          department: result.body[1]._id,
          sem: 5,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(201);
      stId1 = student.body._id;
    });
  });
  describe('not add student with existing mail id ', () => {
    it('should give 500', async () => {
      const result = await request(app.getHttpServer())
        .get('/department/getall')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const student = await request(app.getHttpServer())
        .post('/student/add')
        .send({
          name: 'meet',
          email: 'tarang@gmail.com',
          mobileNumber: 5152456789,
          password: 'meet12',
          department: result.body[1]._id,
          sem: 5,
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(500);
    });
  });

  describe('change student department', () => {
    it('should able to change department of the student', async () => {
      const result = await request(app.getHttpServer())
        .get('/department/getall')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      const student = await studentModel.findOne({ email: 'jeet@gmail.com' });
      await request(app.getHttpServer())
        .patch(`/student/update/admin/${student._id}`)
        .send({
          department: result.body[1]._id,
          name: 'newjeet',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
  //----------------------------------------------------ending Student integration testing----------------------------------------------------//

  //----------------------------------------------------starting attendance integration testing----------------------------------------------------//

  describe('add attendance', () => {
    it('should be add new attendance', async () => {
      const at1: CreateAttendanceDto = {
        studentId: new Types.ObjectId(stId1),
        date: '12-11-2023',
        isPresent: true
      };
      await request(app.getHttpServer()).post('/attendance/add').send(at1).set('Authorization', `Bearer ${token}`).expect(201);
    })
  });

  describe('add attendance', () => {
    it('should be add new attendance', async () => {
      const at1: CreateAttendanceDto = {
        studentId: new Types.ObjectId(stId1),
        date: '13-11-2023',
        isPresent: true
      };
      await request(app.getHttpServer()).post('/attendance/add').send(at1).set('Authorization', `Bearer ${token}`).expect(201);
    })
  });



  describe('get attendance of student by student id', () => {
    it('should be able to get all attendance of student id', async () => {
      const res = await request(app.getHttpServer()).get(`/attendance/student/${stId1}`).set('Authorization', `Bearer ${token}`).expect(200);
      atId1 = res.body[1]._id;
    })
  });

  describe('get single attendance by attendance id', () => {
    it('should be able to get single attendance', async () => {
      console.log('atid1 is ', atId1);
      const res = await request(app.getHttpServer()).get(`/attendance/${atId1}`).set('Authorization', `Bearer ${token}`).expect(200);
    })
  });

  //----------------------------------------------------ending attendance integration testing----------------------------------------------------//


  describe('delete department', () => {
    it('should delete the department', async () => {
      const result = await request(app.getHttpServer()).get('/department/getall').set('Authorization', `Bearer ${token}`).expect(200);
      const dep = await request(app.getHttpServer()).delete(`/department/delete/${result.body[1]._id}`).set('Authorization', `Bearer ${token}`).expect(200);
    })
  });

  //----------------------------------------------------ending Department integration testing----------------------------------------------------//
  describe('delete user ', () => {
    it('should delete the user ', async () => {
      const temp = await userModel.findOne({ email: 'staff2@gmail.com' });
      await request(app.getHttpServer())
        .delete(`/user/delete/${temp.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
  describe('get all users', () => {
    it('should return all the users', async () => {
      await request(app.getHttpServer())
        .get('/user/getAll')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe('read my profile ', () => {
    it('should return login user profile', async () => {
      const result = await request(app.getHttpServer())
        .get('/user/whoami')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(result.body.authToken).not.toBeNull();
    });
  });

  describe('admin updated own profile if it is login', () => {
    it('should be able to update profile', async () => {
      const result = await request(app.getHttpServer())
        .patch('/user/updateOwn')
        .send({
          mobileNumber: 123456789,
          department: 'Head of the department',
        })
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });

  describe("user by it's id ", () => {
    it('should return user ', async () => {
      const temp = await userModel.findOne({ email: 'staff1@gmail.com' });
      const result = await request(app.getHttpServer())
        .get(`/user/${temp.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });
  });
  describe('logout user ', () => {
    it('should log out user and remove the auth token', async () => {
      const temp = await userModel.findOne({ email: 'brook@gmail.com' });
      token = temp.authToken;
      const result = await request(app.getHttpServer())
        .post('/user/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(result.body.authToken).toBeUndefined();
    });
  });

  describe('staff1 login ', () => {
    it('post router for admin login', async () => {
      const user = await request(app.getHttpServer())
        .post('/user/login')
        .send({
          email: 'staff1@gmail.com',
          password: '123',
        })
        .expect(200);
      token = user.body.authToken;
    });
  });

  describe('should get 403 while getting all users because above login as staff', () => {
    it('should return all the users', async () => {
      const temp = await userModel.findOne({ email: 'staff1@gmail.com' });
      token = temp.authToken;
      await request(app.getHttpServer())
        .get('/user/getAll')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);
    });
  });

  describe('login as a staff so only allow change to it password', () => {
    it('should be change only password', async () => {
      const temp = await userModel.findOne({ email: 'staff1@gmail.com' });
      await request(app.getHttpServer())
        .patch('/user/updateStaffItsProfile')
        .send({
          password: '1234',
        })
        .set('Authorization', `Bearer ${temp.authToken}`)
        .expect(200);
    });
  });
});
