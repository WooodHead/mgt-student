import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ErolesUser } from 'src/constants/constant';
import { JwtAuthGuard } from '../auth/guards/auth.jwt-auth.guard';
import { RoleGuard } from '../auth/guards/auth.role-auth.guard';
import { UnionsService } from './unions.service';
import { Response, Request } from 'express';
import { CreateUnionDto } from './dtos/unions.create.dto';
import { ResponseRequest } from 'src/utils/utils.response-api';
import { unionMsg } from 'src/constants/constants.message.response';
import { UserLoginResponseDto } from '../auth/dtos/auth.result.login-service.dto';
import { UpdateUnionDto } from './dtos/unions.update.dto';
import { CreateUnionMemberDto } from './dtos/unions.create.member.dto';
import { CreateUnionImagesDto } from './dtos/unions.create.images.dto';
import { UpdateUnionMember } from './dtos/unions.update.member.dto';
import { UpdateUnionImage } from './dtos/unions.update.image.dto';
import { unionController } from 'src/constants/constants.controller.name-tag';
import { QueryUnionDto } from './dtos/unions.query.dto';
import { QueryUnionMemberDto } from './dtos/unions.query.member.dto';
import { QueryUnionImageDto } from './dtos/unions.query.image.dto';

@Controller(unionController.name)
@ApiTags(unionController.tag)
export class UnionsController {
  constructor(private readonly unionService: UnionsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createUnion(
    @Body() unionDto: CreateUnionDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.unionService.createUnion(unionDto, createdBy);
    return new ResponseRequest(res, result, unionMsg.create);
  }

  @Post('/member')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createUnionMember(
    @Body() memberDto: CreateUnionMemberDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.unionService.createUnionMember(
      memberDto,
      createdBy,
    );
    return new ResponseRequest(res, result, unionMsg.createMember);
  }

  @Post('/image')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async createUnionImage(
    @Body() imageDto: CreateUnionImagesDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const createdBy: string = user.profileId;
    const result = await this.unionService.createUnionImage(
      imageDto,
      createdBy,
    );
    return new ResponseRequest(res, result, unionMsg.createImage);
  }

  @Put('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateUnion(
    @Param('id') id: string,
    @Body() unionDto: UpdateUnionDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.unionService.updateUnion(id, unionDto, updatedBy);
    return new ResponseRequest(res, result, unionMsg.update);
  }

  @Put('/member/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateUnionMember(
    @Param('id') id: string,
    @Body() memberDto: UpdateUnionMember,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.unionService.updateUnionMember(
      id,
      memberDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, unionMsg.updateMember);
  }

  @Put('/image/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async updateUnionImage(
    @Param('id') id: string,
    @Body() imageDto: UpdateUnionImage,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const updatedBy: string = user.profileId;
    const result = await this.unionService.updateUnionImage(
      id,
      imageDto,
      updatedBy,
    );
    return new ResponseRequest(res, result, unionMsg.updateImage);
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteUnion(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.unionService.deleteUnion(id, deletedBy);
    return new ResponseRequest(res, true, unionMsg.delete);
  }

  @Delete('/member/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteUnionMember(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.unionService.deleteUnionMember(id, deletedBy);
    return new ResponseRequest(res, true, unionMsg.deleteMember);
  }

  @Delete('/image/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async deleteUnionImage(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<ResponseRequest> {
    const user: UserLoginResponseDto = req?.user;
    const deletedBy: string = user.profileId;
    await this.unionService.deleteUnionImage(id, deletedBy);
    return new ResponseRequest(res, true, unionMsg.deleteImage);
  }

  @Get()
  async getAllUnion(
    @Query() queryDto: QueryUnionDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.unionService.findAllUnions(queryDto);
    return new ResponseRequest(res, results, unionMsg.getAll);
  }

  @Get('/members')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllUnionMembers(
    @Query() queryDto: QueryUnionMemberDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.unionService.findAllUnionMembers(queryDto);
    return new ResponseRequest(res, results, unionMsg.getAllMembers);
  }

  @Get('/images')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getAllUnionImages(
    @Query() queryDto: QueryUnionImageDto,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const results = await this.unionService.findAllUnionImages(queryDto);
    return new ResponseRequest(res, results, unionMsg.getAllImages);
  }

  @Get('/member/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getUnionMemberById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.unionService.findUnionMemberById(id);
    return new ResponseRequest(res, result, unionMsg.getByIdMember);
  }

  @Get('/image/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard([ErolesUser.SUPPER_ADMIN, ErolesUser.ADMIN]))
  async getUnionImageById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.unionService.findUnionImageById(id);
    return new ResponseRequest(res, result, unionMsg.getByIdImage);
  }

  @Get('/:id')
  async getUnionById(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<ResponseRequest> {
    const result = await this.unionService.findUnionById(id);
    return new ResponseRequest(res, result, unionMsg.getById);
  }
}
