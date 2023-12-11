import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { Department } from './Schemas/dept.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
@Injectable()
export class DepartmentService {
  constructor(@InjectModel(Department.name) private deptModel: mongoose.Model<Department>) { }
  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.deptModel.create(createDepartmentDto);
    } catch (error) {

    }
  }

  async findAll() {
    try {
      return await this.deptModel.find({});
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.deptModel.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, attrs: Partial<Department>) {
    try {
      const department = await this.deptModel.findById(id);
      if (!department) {
        throw new NotFoundException('Department not found');
      }
      Object.assign(department, attrs);
      await department.save();
      return department;
    } catch (error) {

    }
  }

  async remove(id: string) {
    try {
      return await this.deptModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}
