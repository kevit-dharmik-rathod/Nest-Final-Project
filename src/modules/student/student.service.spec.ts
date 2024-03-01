import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { userSchema } from '../user/Schemas/user.schema';
import { StudentService } from './student.service';
import { Model, Types } from 'mongoose';
import { DepartmentService } from '../department/department.service';
import { Student, studentSchema } from './Schemas/student.schema';
import {
  Department,
  departmentSchema,
} from '../department/Schemas/dept.schema';
import { attendanceSchema } from '../attendance/Schemas/attendance.schema';
import { AttendanceService } from '../attendance/attendance.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { depOne, depTwo } from '../../../testStubs/testing.stubs';

describe('StudentService', () => {
  let track: object;
  let studentModel: Model<Student>;
  let service: StudentService;
  let depService: DepartmentService;
  let depModel: Model<Department>;
  let department: Department;
  let student: Student;
  let stId: string;
  let depId1: Types.ObjectId;
  let depId2: string;
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
    }).compile();
    service = module.get<StudentService>(StudentService);
    depService = module.get<DepartmentService>(DepartmentService); // Add this line
    studentModel = module.get<Model<Student>>(getModelToken(Student.name));
    depModel = module.get<Model<Department>>(getModelToken(Department.name));
    await depService.clearDepartment();
    await service.clearStudents();

    const { id } = await depService.create(depOne);
    depId1 = id;
    const { id: newId } = await depService.create(depTwo);
    depId2 = newId;
  });
  it('it should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create student', () => {
    it('should be add student', async () => {
      const student1: CreateStudentDto = {
        name: 'temp',
        email: 'temp@gmail.com',
        mobileNumber: 123456789,
        password: '123',
        department: depId1,
        sem: 5,
        role: 'STUDENT',
        authToken: 'dummy',
      };
      const res = await service.create(student1);
      expect(res).toBeDefined();
      expect(res).not.toBeNull();
    });
  });

  describe('create student', () => {
    it('should be add student', async () => {
      const student1: CreateStudentDto = {
        name: 'temp1',
        email: 'temp1@gmail.com',
        mobileNumber: 123456789,
        password: '123',
        department: depId1,
        sem: 5,
        role: 'STUDENT',
        authToken: 'dummy',
      };
      const res = await service.create(student1);
      expect(res).toBeDefined();
      expect(res).not.toBeNull();
    });
  });

  describe('student login', () => {
    it('should be login student ', async () => {
      const st1 = await service.login('temp@gmail.com', '123');
      expect(st1).not.toBeNull();
      service.setStudentObj({ id: st1._id, role: 'STUDENT' });
    });
  });

  describe('findAll student', () => {
    it('should return all students', async () => {
      const res1 = await service.findAll();
      expect(res1).not.toBeNull();
    });
  });

  describe('show profile', () => {
    it('should return student profile', async () => {
      const res = await service.showMyProfile();
      expect(res).not.toBeNull();
    });
  });

  describe('change student password', () => {
    it('should change student password', async () => {
      const res = await service.updateMyPassword({
        password: '1234',
      });
      expect(res).not.toBeNull();
    });
  });

  describe('change student details by admin', () => {
    it('should be able to change student details', async () => {
      console.log(service.getStudentObj()['id']);
      const student = await service.findOne(service.getStudentObj()['id']);
      console.log('student old department is  ', student.department);
      console.log('student new department is ', depId2);
      const res = await service.update(service.getStudentObj()['id'], {
        department: depId2,
        name: 'new test name',
      });
      expect(res).not.toBeNull();
    });
  });

  describe('logout student ', () => {
    it('should log out the student ', async () => {
      const st1 = await service.logout();
      expect(st1).toBe('Student logout successfully');
    });
  });

  describe('remove student by id', () => {
    it('should be delete student', async () => {
      const id = await service.getStudentObj()['id'];
      const res = await service.remove(id);
    });
  });

  describe('bot show profile after logout', () => {
    it('should not return student profile', async () => {
      const res = await service.showMyProfile();
      expect(res).toBeNull();
    });
  });
});
