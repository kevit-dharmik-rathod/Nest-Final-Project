import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { NotFoundException } from '@nestjs/common';

describe('DepartmentService', () => {
  let service: DepartmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DepartmentService],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      const result = await service.create(createDepartmentDto);

      expect(result).toHaveProperty('_id');
      expect(result.name).toEqual(createDepartmentDto.name);
    });
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const result = await service.findAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('findOne', () => {
    it('should return a department by id', async () => {
      const departmentId = 'some-department-id';
      const result = await service.findOne(departmentId);
      expect(result).toHaveProperty('_id', departmentId);
    });

    it('should throw NotFoundException if department is not found', async () => {
      const nonExistingDepartmentId = 'non-existing-department-id';

      await expect(
        service.findOne(nonExistingDepartmentId),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a department by id', async () => {
      const departmentId = 'some-department-id';
      const updateAttrs = { name: 'Updated Department' };

      const result = await service.update(departmentId, updateAttrs);

      expect(result).toHaveProperty('_id', departmentId);
      expect(result.name).toEqual(updateAttrs.name);
    });

    it('should throw NotFoundException if department is not found', async () => {
      const nonExistingDepartmentId = 'non-existing-department-id';
      const updateAttrs = { name: 'Updated Department' };

      await expect(
        service.update(nonExistingDepartmentId, updateAttrs),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a department by id', async () => {
      const departmentId = 'some-department-id';

      const result = await service.remove(departmentId);

      expect(result).toEqual('Department deleted successfully');
    });

    it('should throw NotFoundException if department is not found', async () => {
      const nonExistingDepartmentId = 'non-existing-department-id';

      await expect(
        service.remove(nonExistingDepartmentId),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
