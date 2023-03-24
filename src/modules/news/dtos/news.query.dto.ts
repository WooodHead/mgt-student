import { ApiProperty } from '@nestjs/swagger';
import { QueryPagination } from 'src/utils/page.query.pagination.dto';
import { EtypeNews } from 'src/constants/constant';
import { IsOptional, IsString } from 'class-validator';
export class QueryNewDto extends QueryPagination {
  @IsOptional()
  @IsString()
  @ApiProperty({ enum: EtypeNews, default: EtypeNews.UNIVERSITY })
  type?: string;
}
