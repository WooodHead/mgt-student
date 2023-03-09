import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import {
  Attachment,
  AttachmentDocument,
} from '../attachments/schemas/attachments.schema';
import {
  Profile,
  ProfileDocument,
} from '../users/schemas/users.profile.schema';
import { CreateMultiStaffDepartmentDto } from './dtos/department.staff.create-multi.dto';
import { CreateDepartmentDto } from './dtos/departments.create.dto';
import { Departments, DepartmentsDocument } from './schemas/departments.schema';
import {
  DepartmentStaff,
  DepartmentStaffDocument,
} from './schemas/departments.staff.schema';
import { unionBy } from 'lodash';
import { CreateStaffDepartmentDto } from './dtos/department.staff.create.dto';
import { Rooms, RoomsDocument } from '../rooms/schemas/rooms.schema';
import { ErolesUser, EroomType } from 'src/constants/constant';
import { UpdateDepartmentDto } from './dtos/department.update.dto';
import { Users, UsersDocument } from '../users/schemas/users.schema';
import { UpdateStaffDepartmentDto } from './dtos/department.staff.update.dto';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Departments.name)
    private readonly deparmentSchema: Model<DepartmentsDocument>,
    @InjectModel(DepartmentStaff.name)
    private readonly staffSchema: Model<DepartmentStaffDocument>,
    @InjectModel(Profile.name)
    private readonly profileSchema: Model<ProfileDocument>,
    @InjectModel(Attachment.name)
    private readonly attachmentSchema: Model<AttachmentDocument>,
    @InjectModel(Rooms.name)
    private readonly roomSchema: Model<RoomsDocument>,
    @InjectModel(Users.name)
    private readonly userSchema: Model<UsersDocument>,
  ) {}

  async validateDepartment(departmentDto: CreateDepartmentDto): Promise<void> {
    const { manager, contacts, attachment = [] } = departmentDto;

    if (contacts.office) {
      const officeInfo = await this.roomSchema.findOne({
        _id: new Types.ObjectId(contacts?.office),
        type: EroomType.OFFICE_DEPARTMENT,
      });
      if (!officeInfo) {
        new CommonException(404, 'Office not found.');
      }
    }
    if (manager) {
      const managerInfo = await this.profileSchema.findById(manager);
      if (!managerInfo) {
        new CommonException(404, 'Manager not found.');
      }
    }

    if (attachment.length > 0) {
      for (const item in attachment) {
        const attachmentInfo = await this.attachmentSchema.findById(item);
        if (!attachmentInfo) {
          new CommonException(404, `Attachment ${item} not found.`);
        }
      }
    }
  }

  async createDepartment(
    departmentDto: CreateDepartmentDto,
  ): Promise<Departments> {
    await this.validateDepartment(departmentDto);
    const newDocument = await new this.deparmentSchema(departmentDto).save();
    const result = await this.findDepartmentById(newDocument._id);
    return result;
  }

  async updateDepartment(
    id: string,
    departmentDto: UpdateDepartmentDto,
  ): Promise<Departments> {
    await this.validateDepartment(departmentDto);
    await this.deparmentSchema.findByIdAndUpdate(id, departmentDto);
    const result = await this.findDepartmentById(id);
    return result;
  }

  async findDepartmentById(id: string): Promise<Departments> {
    const result = await this.deparmentSchema
      .findById(id)
      .populate('manager', '', this.profileSchema)
      .populate('attachment', '', this.attachmentSchema)
      .populate('contacts.office', '', this.roomSchema)
      .exec();
    if (!result) {
      new CommonException(404, 'Department not found.');
    }
    return result;
  }

  async findAllDepartment(): Promise<Departments[]> {
    const aggregateLookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: 'manager',
        foreignField: '_id',
        as: 'manager',
        unwind: true,
      },
      {
        from: 'attachments',
        localField: 'attachment',
        foreignField: '_id',
        as: 'attachment',
        unwind: false,
      },
      {
        from: 'rooms',
        localField: 'contacts.office',
        foreignField: '_id',
        as: 'office',
        unwind: true,
      },
      {
        from: 'departmentstaffs',
        localField: '_id',
        foreignField: 'department',
        as: 'department',
        unwind: false,
      },
      {
        from: 'profiles',
        localField: 'department.staff',
        foreignField: '_id',
        as: 'staffs',
        unwind: false,
      },
    ]);
    const results = await this.deparmentSchema.aggregate(aggregateLookup);
    return results;
  }

  async createMultiStaffDepartment(
    staffDto: CreateMultiStaffDepartmentDto,
  ): Promise<DepartmentStaff[]> {
    const { department, staffs = [] } = staffDto;
    await this.findDepartmentById(department);
    const staffLists = unionBy(staffs, 'staff');
    const results = [];
    for (const item of staffLists) {
      try {
        const staffInfo = await this.findUserProfile(item.staff);
        if (!staffInfo) {
          continue;
        }
        if (staffInfo.user?.role !== ErolesUser.STAFF) {
          continue;
        }
        const dto: CreateStaffDepartmentDto | Record<string, any> = {
          department,
          staff: item?.staff,
          joinDate: item?.joinDate || Date.now(),
        };
        const result = await new this.staffSchema(dto).save();
        results.push(result);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
    return results;
  }

  async createDepartmentStaff(
    staffDto: CreateStaffDepartmentDto,
  ): Promise<DepartmentStaff> {
    const { department, staff } = staffDto;
    await this.findDepartmentById(department);
    const staffInfo = await this.findUserProfile(staff);
    if (!staffInfo) {
      new CommonException(404, 'Staff not found.');
    }
    const result = await new this.staffSchema(staffDto).save();
    return result;
  }

  async updateDepartmentStaff(
    id: string,
    staffDto: UpdateStaffDepartmentDto,
  ): Promise<DepartmentStaff> {
    const { department, joinDate } = staffDto;
    if (department) {
      await this.findDepartmentById(department);
    }
    const staff: Record<string, any> = await this.staffSchema.findById(id);
    if (!staff) {
      new CommonException(404, 'Staff not found.');
    }
    staff.department = department || staff.department;
    staff.joinDate = joinDate || staff.joinDate;
    await staff.save();
    return staff;
  }

  async deleteDepartmentStaff(id: string): Promise<void> {
    const staff: Record<string, any> = await this.staffSchema.findById(id);
    if (!staff) {
      new CommonException(404, 'Staff not found.');
    }
    await this.staffSchema.findByIdAndDelete(id);
  }

  async findUserProfile(profile: string): Promise<Record<string, any>> {
    const staffInfo: Record<string, any> = await this.profileSchema
      .findById(profile)
      .populate('user', '', this.userSchema)
      .exec();
    return staffInfo;
  }
}
