import { Types } from 'mongoose';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
import { CreateDepartmentDto } from 'src/modules/department/dto/create-department.dto';
const Admin: CreateUserDto & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    name: 'brook',
    email: 'brook@gmail.com',
    password: '123',
    designation: 'teacher',
    mobileNumber: 6361775548,
    department: 'Management',
    role: 'ADMIN'
};

const staffOne: CreateUserDto & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    name: 'updatestaffname',
    email: 'staff1@gmail.com',
    password: '123',
    designation: 'teacher',
    mobileNumber: 6361775548,
    department: 'Management',
    role: 'STAFF'
}

const staffTwo: CreateUserDto & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    name: 'staff2',
    email: 'staff2@gmail.com',
    password: '123',
    designation: 'teacher',
    mobileNumber: 6361775548,
    department: 'Management',
    role: 'STAFF'
}

const depOne: CreateDepartmentDto & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    name: "Computer Engineering",
    initial: "CE-2023",
    availableSeats: 5,
    occupiedSeats: 0,
    batch: 2023
}

const depTwo: CreateDepartmentDto & { _id: Types.ObjectId } = {
    _id: new Types.ObjectId(),
    name: "Electrical Engineering",
    initial: "EE-2023",
    availableSeats: 5,
    occupiedSeats: 0,
    batch: 2023
}

export {
    Admin,
    staffOne,
    staffTwo,
    depOne,
    depTwo
}