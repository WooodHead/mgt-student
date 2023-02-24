import { ApiProperty } from '@nestjs/swagger';
import { TitleLeaDerSchoolDto } from './user.create.leader-school.title.dto';

export class CreateLeaderSchoolDto {
  @ApiProperty({ required: true })
  profile?: string;

  @ApiProperty({ required: true, type: [TitleLeaDerSchoolDto] })
  title?: TitleLeaDerSchoolDto[];
}