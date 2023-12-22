import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { userSchema } from '../user/Schemas/user.schema';
import { StudentService } from '../student/student.service';
import { Model, Types } from 'mongoose';
import { DepartmentService } from '../department/department.service';
import { Student, studentSchema } from '../student/Schemas/student.schema';
import {
  Department,
  departmentSchema,
} from '../department/Schemas/dept.schema';
import { attendanceSchema } from '../attendance/Schemas/attendance.schema';
import { AttendanceService } from '../attendance/attendance.service';
import { depOne, depTwo } from '../../../testStubs/testing.stubs';

describe('StudentService', () => {
  let track: object;
  let studentModel: Model<Student>;
  let attendanceService: AttendanceService;
  let studentService: StudentService;
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
    depService = module.get<DepartmentService>(DepartmentService);
    attendanceService = module.get<AttendanceService>(AttendanceService);
    studentService = module.get<StudentService>(StudentService); // Add this line
    studentModel = module.get<Model<Student>>(getModelToken(Student.name));
    depModel = module.get<Model<Department>>(getModelToken(Department.name));
    await studentService.clearStudents();
    const { id } = await depService.create(depOne);
    depId1 = id;
    const { id: newId } = await depService.create(depTwo);
    depId2 = newId;
  });
});
