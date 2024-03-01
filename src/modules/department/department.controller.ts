import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { RolesGuard } from '../../guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../user/decorators/user.decorator';
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  //Query1 for getting year, totalStudents and branch wise total students
  @Get('/query1')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async query1() {
    return await this.departmentService.task1();
  }

  //Query2 for getting list of students absent on specific day
  @Post('/query2')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async query2(@Body() body: object) {
    return await this.departmentService.task2(body);
  }

  //Query3 for getting list of student which attendance is less than 75% up to date which we give as a input.
  @Post('/query3')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  async query3(@Body() body: object) {
    return await this.departmentService.task3(body);
  }
  //Query4 getting vacant seats year wise
  @Post('/query4')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async query4(@Body() body: object) {
    return await this.departmentService.task4(body);
  }

  /**
   *
   * @param createDepartmentDto of department body
   * @returns department object
   */
  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  /**
   *
   * @returns department array
   */
  @Get('/getall')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.departmentService.findAll();
  }

  /**
   *
   * @param id of department
   * @returns department object
   */
  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  /**
   *
   * @param id of department
   * @param body of department
   * @returns department object
   */
  @Patch('/update/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() body: object) {
    return this.departmentService.update(id, body);
  }

  /**
   *
   * @param id of department
   * @returns delete message of string
   */
  @Delete('/delete/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
