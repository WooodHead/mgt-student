import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from '../users/schemas/users.profile.schema';
import { Users, UsersSchema } from '../users/schemas/users.schema';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { Departments, DepartmentSchema } from './schemas/departments.schema';
import {
  Department_Staff,
  DepartmentStaffSchema,
} from './schemas/departments.staff.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Departments.name,
        schema: DepartmentSchema,
      },
      { name: Department_Staff.name, schema: DepartmentStaffSchema },
      { name: Profile.name, schema: ProfileSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
  ],
  providers: [DepartmentsService],
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
