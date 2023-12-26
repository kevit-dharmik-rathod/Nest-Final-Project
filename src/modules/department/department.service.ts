import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { Department } from './Schemas/dept.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { ObjectId } from 'mongoose';
import { StudentService } from '../student/student.service';
@Injectable()
export class DepartmentService {
  private readonly logger = new Logger(DepartmentService.name);
  constructor(
    @InjectModel(Department.name) private deptModel: mongoose.Model<Department>,
    @Inject(forwardRef(() => StudentService))
    private studentService: StudentService,
  ) {}

  /**
   *
   * @param createDepartmentDto of department body
   * @returns department object
   */
  async create(createDepartmentDto: CreateDepartmentDto) {
    try {
      return await this.deptModel.create(createDepartmentDto);
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @returns department array
   */
  async findAll() {
    try {
      return await this.deptModel.find({});
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param id of department
   * @returns department object
   */
  async findOne(id: string | ObjectId) {
    try {
      const result = await this.deptModel.findById(id);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param id of department
   * @param body of department
   * @returns department object
   */
  async update(id: string, attrs: Partial<Department>) {
    try {
      const department = await this.deptModel.findById(id);
      if (!department) {
        throw new NotFoundException('Department not found');
      }
      Object.assign(department, attrs);
      await department.save();
      return department;
    } catch (error) {}
  }

  /**
   *
   * @param id of department
   * @returns delete message of string
   */
  async remove(id: string): Promise<String> {
    try {
      await this.studentService.deleteStudents(id);
      await this.deptModel.findByIdAndDelete(id);
      return 'Department deleted successfully';
    } catch (error) {
      throw error;
    }
  }

  /**
   * clear department collection
   * @returns delete acknowledgement
   */
  async clearDepartment(): Promise<String> {
    try {
      await this.deptModel.deleteMany({});
      return 'Department deleted successfully';
    } catch (error) {
      throw error;
    }
  }
  async task1() {
    try {
      const pipeLine: any = [
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id: '$batch',
              totalStudents: {
                $sum: '$occupiedSeats',
              },
              branches: {
                $push: {
                  initial: '$initial',
                  occupiedSeats: '$occupiedSeats',
                },
              },
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              department: {
                $map: {
                  input: '$branches',
                  as: 'tempData',
                  in: {
                    k: '$$tempData.initial',
                    v: '$$tempData.occupiedSeats',
                  },
                },
              },
              totalStudents: 1,
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              _id: 0,
              year: '$_id',
              branches: {
                $arrayToObject: '$department',
              },
              totalStudents: 1,
            },
        },
      ];
      return await this.deptModel.aggregate(pipeLine);
    } catch (error) {
      this.logger.error(`Error in services while task1 performed : ${error}`);
      throw error;
    }
  }

  async task2(body: object) {
    try {
      const pipeLine: any = [
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: 'students',
              localField: '_id',
              foreignField: 'department',
              as: 'studentDetails',
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: '$studentDetails',
            },
        },
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: 'attendances',
              localField: 'studentDetails._id',
              foreignField: 'studentId',
              as: 'attendance',
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: '$attendance',
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              _id: 0,
              name: '$studentDetails.name',
              department: '$name',
              year: '$batch',
              date: '$attendance.date',
              present: '$attendance.isPresent',
            },
        },
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              date: body['date'],
              present: false,
            },
        },
      ];
      if (body.hasOwnProperty('batch')) {
        pipeLine.push({
          $match: {
            batch: body['batch'],
          },
        });
      }
      if (body.hasOwnProperty('branch')) {
        pipeLine.push({
          $match: {
            branch: body['branch'],
          },
        });
      }
      if (body.hasOwnProperty('sem')) {
        pipeLine.push({
          $match: {
            branch: body['sem'],
          },
        });
      }
      return await this.deptModel.aggregate(pipeLine);
    } catch (error) {
      this.logger.error(
        `Error in services while getting absent students: ${error}`,
      );
      throw error;
    }
  }

  async task3(body: object) {
    try {
      const pipeLine: any = [
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: 'students',
              localField: '_id',
              foreignField: 'department',
              as: 'studentDetails',
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: '$studentDetails',
            },
        },
        {
          $lookup:
            /**
             * from: The target collection.
             * localField: The local join field.
             * foreignField: The target join field.
             * as: The name for the results.
             * pipeline: Optional pipeline to run on the foreign collection.
             * let: Optional variables to use in the pipeline field stages.
             */
            {
              from: 'attendances',
              localField: 'studentDetails._id',
              foreignField: 'studentId',
              as: 'attendance',
            },
        },
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: '$attendance',
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              _id: 0,
              branch: '$name',
              sem: '$studentDetails.sem',
              studentId: '$studentDetails._id',
              name: '$studentDetails.name',
              email: '$studentDetails.email',
              mobile: '$studentDetails.mobile',
              department: '$name',
              year: '$batch',
              date: '$attendance.date',
              present: '$attendance.isPresent',
            },
        },
        {
          $match: {
            date: {
              $lte: body['date'],
            },
          },
        },
        {
          $group:
            /**
             * newField: The new field name.
             * expression: The new field expression.
             */
            {
              _id: '$studentId',
              totalAttendances: {
                $sum: 1,
              },
              actualAttendances: {
                $sum: {
                  $cond: ['$present', 1, 0],
                },
              },
              name: {
                $first: '$name',
              },
              email: {
                $first: '$email',
              },
              mobile: {
                $first: '$mobile',
              },
              batch: {
                $first: '$year',
              },
              branch: {
                $first: '$branch',
              },
              sem: {
                $first: '$sem',
              },
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              _id: 0,
              studentId: '$_id',
              name: 1,
              email: 1,
              mobile: 1,
              sem: 1,
              branch: 1,
              batch: 1,
              attendancePercentage: {
                $multiply: [
                  {
                    $divide: ['$actualAttendances', '$totalAttendances'],
                  },
                  100,
                ],
              },
            },
        },
        {
          $match:
            /**
             * query: The query in MQL.
             */
            {
              attendancePercentage: {
                $lt: 75,
              },
            },
        },
      ];
      if (body.hasOwnProperty('batch')) {
        pipeLine.push({
          $match: {
            batch: body['batch'],
          },
        });
      }
      if (body.hasOwnProperty('branch')) {
        pipeLine.push({
          $match: {
            branch: body['branch'],
          },
        });
      }
      if (body.hasOwnProperty('sem')) {
        pipeLine.push({
          $match: {
            branch: body['sem'],
          },
        });
      }
      return await this.deptModel.aggregate(pipeLine);
    } catch (error) {
      this.logger.error(
        `Error in department services while executing task3 :${error.message}`,
      );
    }
  }

  async task4(body: object) {
    try {
      const pipeLine: any = [
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id: '$batch',
              totalStudents: {
                $sum: '$occupiedSeats',
              },
              totalStudentsIntake: {
                $sum: '$availableSeats',
              },
              makeBranches: {
                $push: {
                  name: '$initial',
                  totalStudents: '$availableSeats',
                  totalStudentsIntake: '$occupiedSeats',
                  availableIntake: {
                    $subtract: ['$availableSeats', '$occupiedSeats'],
                  },
                },
              },
            },
        },
        {
          $project:
            /**
             * newField: The new field name.
             * expression: The new field expression.
             */
            {
              _id: 0,
              batch: '$_id',
              totalStudents: 1,
              totalStudentsIntake: 1,
              branches: {
                $map: {
                  input: '$makeBranches',
                  as: 'data',
                  in: {
                    k: '$$data.name',
                    v: {
                      totalStudents: '$$data.totalStudents',
                      totalStudentsIntake: '$$data.totalStudentsIntake',
                      availableIntake: '$$data.availableIntake',
                    },
                  },
                },
              },
            },
        },
        {
          $project:
            /**
             * specifications: The fields to
             *   include or exclude.
             */
            {
              _id: 0,
              batch: '$batch',
              totalStudents: 1,
              totalStudentsIntake: 1,
              branches: {
                $arrayToObject: '$branches',
              },
            },
        },
      ];
      if (body.hasOwnProperty('batch')) {
        pipeLine.unshift({
          $match: {
            batch: body['batch'],
          },
        });
      }
      if (body.hasOwnProperty('branch')) {
        pipeLine.unshift({
          $match: {
            initial: body['branch'],
          },
        });
      }
      return await this.deptModel.aggregate(pipeLine);
    } catch (error) {
      this.logger.error(
        `Error in task4 in department service: ${error.message}`,
      );
      throw error;
    }
  }
}
