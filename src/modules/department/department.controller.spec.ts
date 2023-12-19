import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { StudentService } from '../student/student.service';
import { NotFoundException } from '@nestjs/common';
import { Department } from './Schemas/dept.schema';

jest.mock('./department.service');

describe('DepartmentController', () => {
  let controller: DepartmentController;
  let service: DepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        DepartmentService,
        {
          provide: getModelToken(Department.name),
          useValue: jest.fn(),
        },
        StudentService,
      ],
    }).compile();

    controller = module.get<DepartmentController>(DepartmentController);
    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new department', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'Test Department',
        initial: '',
        availableSeats: 0,
        occupiedSeats: 0,
        batch: 0,
      };

      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(createDepartmentDto));

      const result = await controller.create(createDepartmentDto);

      expect(result).toEqual(createDepartmentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const departments = [{ name: 'Department 1' }, { name: 'Department 2' }];
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(departments));

      const result = await controller.findAll();

      expect(result).toEqual(departments);
    });
  });

  describe('findOne', () => {
    it('should return a department by ID', async () => {
      const departmentId = 'some-department-id';
      const department = { name: 'Test Department' };

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(department));

      const result = await controller.findOne(departmentId);

      expect(result).toEqual(department);
    });

    it('should throw NotFoundException if department is not found', async () => {
      const departmentId = 'non-existing-department-id';

      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(null));

      await expect(controller.findOne(departmentId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});

describe('DepartmentService', () => {
  let service: DepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentService,
        {
          provide: getModelToken(Department.name),
          useValue: jest.fn(),
        },
        StudentService,
      ],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
