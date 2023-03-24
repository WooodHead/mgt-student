import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';
import { EuserGender } from 'src/constants/constant';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { IdentityCardNumberDto } from './user.profile.identityCardNumber.dto';
import { LocationProfileDto } from './user.profile.location.dto';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  lastName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  middleName?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  classId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  faculty?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  major?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  course?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  degreeLevel?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  avatar?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ default: '0948494849' })
  mobile?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    enum: EuserGender,
    default: EuserGender.MALE,
  })
  gender?: string;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  @ApiProperty()
  dateOfBirth?: Date;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  joinDate?: Date;

  @IsOptional()
  @ApiProperty({ default: new GetCurrentDate().getYearMonthDate() })
  @ApiProperty()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: [String],
    default: ['class president'],
  })
  positionHeld?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({
    type: [String],
    description: 'Should award old and award new',
  })
  award?: string[];

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: LocationProfileDto })
  location?: LocationProfileDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: IdentityCardNumberDto })
  identityCardNumber?: IdentityCardNumberDto;

  @IsOptional()
  @IsString()
  @ApiProperty()
  object?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  unionDate?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  communistPartyDay?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  ethnic?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  religion?: string;
}
