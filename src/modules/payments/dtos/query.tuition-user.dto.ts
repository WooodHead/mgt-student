import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueryTuitionUser {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  semester: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  profile?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  faculty?: string;
}
