import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { RolesGuard } from '../user/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../user/decorators/user.decorator';
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post('/add')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Get('/getall')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.departmentService.findAll();
  }

  @Get('/:id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Patch('/update/:id')
  update(@Param('id') id: string, @Body() body: object) {
    return this.departmentService.update(id, body);
  }

  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
