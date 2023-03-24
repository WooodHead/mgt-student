import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { GetCurrentDate } from 'src/utils/get.current-date';
import { ContactSchoolDto } from './school.contact.dto';
import { LocationSchoolDto } from './school.location.dto';
import { PoliCySchoolDto } from './school.policy.dto';

export class CreateSchoolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  schoolCode?: string;

  @IsNumber()
  @ApiProperty({ default: 40000 })
  numberTotal?: number;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  image?: string[];

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  award?: string[];

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: LocationSchoolDto })
  location?: LocationSchoolDto;

  @IsOptional()
  @IsObject()
  @ApiProperty({ type: ContactSchoolDto })
  contactInfo?: ContactSchoolDto;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [PoliCySchoolDto] })
  policy?: PoliCySchoolDto[];

  @ApiProperty({
    required: true,
    default: new GetCurrentDate().getYearMonthDate(),
  })
  yearFound?: Date;

  @IsOptional()
  @IsString()
  @ApiProperty()
  generalInfo?: string;
}
