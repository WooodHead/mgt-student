import { ApiProperty } from '@nestjs/swagger';
import { EstatusPayments, EtypePayments } from 'src/constants/constant';

export class UpdateUserPaymentDto {
  @ApiProperty({ required: true })
  semester?: string;

  @ApiProperty({ required: true, default: 0 })
  totalMoney?: number;

  @ApiProperty({ required: true, default: EtypePayments.CASH })
  type?: string;

  @ApiProperty({ required: true, default: EstatusPayments.OWED })
  status?: string;
}
