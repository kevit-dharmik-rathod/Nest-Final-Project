import { Types } from 'mongoose';
import { CreateUserDto } from '../src/modules/user/dto/create-user.dto';
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
export {
    Admin,
    staffOne,
    staffTwo
}