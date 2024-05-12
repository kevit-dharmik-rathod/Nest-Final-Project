import { Model } from 'mongoose';
import { Student, studentSchema } from '../student/Schemas/student.schema';
import { StudentService } from '../student/student.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { attendanceSchema } from '../attendance/Schemas/attendance.schema';
import { Department, departmentSchema } from './Schemas/dept.schema';
import { DepartmentService } from './department.service';
import { AttendanceService } from '../attendance/attendance.service';
import { depOne } from '../../../testStubs/testing.stubs';
import { DepartmentController } from './department.controller';

describe('StudentController', () => {
  let studentModel: Model<Student>;
  let controller: DepartmentController;
  let depService: DepartmentService;
  let depModel: Model<Department>;
  let depId: string;
  beforeAll(async () => {
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
      controllers: [DepartmentController],
    }).compile();
    depService = module.get<DepartmentService>(DepartmentService);
    depModel = module.get<Model<Department>>(getModelToken(Department.name));

    await depService.clearDepartment();
  });

  describe('create department', () => {
    it('should be added new department', async () => {
      const res = await depService.create(depOne);
      depId = res.id;
      expect(res).not.toBeNull();
    });
  });

  describe('get all departments', () => {
    it('should return all the department', async () => {
      const res = await depService.findAll();
      expect(res.length).toBeGreaterThan(0);
      expect(res).not.toBeNull();
    });
  });

  describe('get department by id ', () => {
    it('should return department', async () => {
      const res = await depService.findOne(depId);
      expect(res).not.toBeNull();
    });
  });
  describe('update department', () => {
    it('should update department', async () => {
      const res = await depService.update(depId, {
        name: 'new computer department',
      });
      expect(res).not.toBeNull();
    });
  });

  describe('delete department ', () => {
    it('should be able to delete department ', async () => {
      const res = await depService.remove(depId);
      expect(res).toBe('Department deleted successfully');
    });
  });
});
