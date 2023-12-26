import { Model } from 'mongoose';
import { Student, studentSchema } from './Schemas/student.schema';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { UserController } from '../user/user.controller';
import { attendanceSchema } from '../attendance/Schemas/attendance.schema';
import {
  Department,
  departmentSchema,
} from '../department/Schemas/dept.schema';
import { DepartmentService } from '../department/department.service';
import { AttendanceService } from '../attendance/attendance.service';
import { depOne } from '../../../testStubs/testing.stubs';
import { CreateStudentDto } from './dto/create-student.dto';

describe('StudentController', () => {
  let track: object;
  let studentModel: Model<Student>;
  let controller: StudentController;
  let service: StudentService;
  let depService: DepartmentService;
  let depModel: Model<Department>;
  let department: Department;
  let student: Student;
  let stId: string;
  beforeAll(async () => {
    process.env.NEST_ENV = 'test';
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env',
          isGlobal: true,
        }),
        MongooseModule.forRoot(process.env.TEST_MONGODB_URL, {
          dbName: process.env.TEST_MONGODB_DB_NAME,
        }),
        MongooseModule.forFeature([{ name: 'Student', schema: studentSchema }]),
        MongooseModule.forFeature([
          {
            name: 'Department',
            schema: departmentSchema,
          },
        ]),
        MongooseModule.forFeature([
          {
            name: 'Attendance',
            schema: attendanceSchema,
          },
        ]),
      ],
      providers: [StudentService, DepartmentService, AttendanceService],
      controllers: [StudentController],
    }).compile();
    service = module.get<StudentService>(StudentService);
    depService = module.get<DepartmentService>(DepartmentService); // Add this line
    studentModel = module.get<Model<Student>>(getModelToken(Student.name));
    depModel = module.get<Model<Department>>(getModelToken(Department.name));
    controller = module.get<StudentController>(StudentController);

    await depService.clearDepartment();
    await service.clearStudents();
    department = await depModel.create(depOne);
  });
  it('it should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('add student', () => {
    it('should be able to add new student', async () => {
      const student1: CreateStudentDto = {
        name: 'temp',
        email: 'temp@gmail.com',
        mobileNumber: 123456789,
        password: '123',
        department: department['_id'],
        sem: 5,
        role: 'STUDENT',
        authToken: 'dummy',
      };
      const st1 = await controller.create(student1);
      expect(st1).not.toBeNull();
    });
  });

  describe('login student', () => {
    it('should student login properly', async () => {
      const st1 = await controller.studentLogin({
        email: 'temp@gmail.com',
        password: '123',
      });
      expect(st1).not.toBeNull();
      service.setStudentObj({ id: st1._id, role: 'STUDENT' });
    });
  });
  describe('read profile ', () => {
    it('should able to read profile', async () => {
      const result = await controller.whoami();
      expect(result).not.toBeNull();
    });
  });
  describe('update student password', () => {
    it('should change only password', async () => {
      const res = await controller.updateMyProfile({
        password: '1234',
      });
      expect(res).not.toBeNull();
    });
  });
  describe('not login with old password', () => {
    it('should student not login properly', async () => {
      expect.assertions(1);
      await expect(
        controller.studentLogin({
          email: 'temp@gmail.com',
          password: 'incorrect_password', // Provide an incorrect password
        }),
      ).rejects.toThrow('password is incorrect');
    });
  });

  describe('get all students', () => {
    it('should return all students', async () => {
      const res = await controller.findAll();
      stId = res[0].id;
      expect(res).not.toBeNull();
    });
  });
  describe('get student by id ', () => {
    it('should return student ', async () => {
      const res = await controller.findOne(stId);
      expect(res).not.toBeNull();
    });
  });

  describe('logout student', () => {
    it('should be able to log out', async () => {
      const res = await controller.studentLogout();
      expect(res).toBe('Student logout successfully');
    });
  });

  describe('delete student', () => {
    it('should be deleted student', async () => {
      const res = await controller.remove(stId);
    });
  });
});
