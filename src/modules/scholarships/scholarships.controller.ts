import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UseGuards,
  Query,
  Param,
  Put,
  Req,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { CreateUserScholarshipInSemester } from './dtos/scholarship.user-semester.create.dto';
import { CreateScholarshipDto } from './dtos/scholarship.create.dto';
import { QueryScholarshipDto } from './dtos/scholarship.query.dto';
import { QueryUserScholarshipDto } from './dtos/scholarship.user.query.dto';
import { ScholarshipService } from './scholarships.service';
import { Response, Request } from 'express';
import { scholarshipMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { scholarshipController } from 'src/constants/constants.controller.name-tag';
import { UpdateScholarshipDto } from './dtos/scholarship.update.dto';

@Controller(scholarshipController.name)
@ApiTags(scholarshipController.tag)
export class ScholarshipController {
  constructor(private readonly service: ScholarshipService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createScholarship(
    @Body() scholarshipDto: CreateScholarshipDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.service.createScholarship(
      scholarshipDto,
      createdBy,
    );
    return new ResponseRequest(res, result, scholarshipMsg.create);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateScholarship(
    @Param('id') id: string,
    @Body() updateScholarshipDto: UpdateScholarshipDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.service.updateScholarship(
      id,
      updateScholarshipDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, scholarshipMsg.update);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteScholarship(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.service.deleteScholarship(id, deletedBy);
    return new ResponseRequest(res, true, scholarshipMsg.delete);
  }

  @Delete('/user/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteUserScholarship(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.service.deleteUserScholarship(id, deletedBy);
    return new ResponseRequest(res, true, scholarshipMsg.deleteUser);
  }

  @Get()
  async getAllScholarship(
    @Query() queryDto: QueryScholarshipDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findAllScholarship(queryDto);
    return new ResponseRequest(res, result, scholarshipMsg.getAll);
  }

  @Post('/user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createUserScholarshipInSemester(
    @Body() dto: CreateUserScholarshipInSemester,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.service.createUserScholarshipInSemester(
      dto.semester,
      createdBy,
    );
    return new ResponseRequest(res, result, scholarshipMsg.createUser);
  }

  @Get('/user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getUserScholarship(
    @Query() dto: QueryUserScholarshipDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findAllUserScholarShip(dto);
    return new ResponseRequest(res, result, scholarshipMsg.getAllUsers);
  }

  @Get('/:id')
  async getScholarshipById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.service.findScholarshipById(id);
    return new ResponseRequest(res, result, scholarshipMsg.getById);
  }
}
