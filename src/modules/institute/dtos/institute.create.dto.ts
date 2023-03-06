import { ApiProperty } from '@nestjs/swagger';
import { ContactInstituteDto } from './institute.contact.dto';
import { FunctionAndTaskInstituteDto } from './institute.function-task.dto';

export class CreateInstituteDto {
  @ApiProperty({ required: true })
  unitName?: string;

  @ApiProperty({ required: true })
  url?: string;

  @ApiProperty({ required: true })
  foundYear?: string;

  @ApiProperty({ required: true })
  parson?: string;

  @ApiProperty({ required: true })
  viceParson?: string;

  @ApiProperty({ type: ContactInstituteDto, required: true })
  contacts?: ContactInstituteDto;

  @ApiProperty({ required: true, type: [FunctionAndTaskInstituteDto] })
  function?: FunctionAndTaskInstituteDto[];

  @ApiProperty({ required: true, type: [FunctionAndTaskInstituteDto] })
  task?: FunctionAndTaskInstituteDto[];

  @ApiProperty({ required: false })
  attachment?: string[];
}
