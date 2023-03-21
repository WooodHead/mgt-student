/* eslint-disable @typescript-eslint/naming-convention */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import {
  collectionNames,
  EstatusPayments,
  EtypePayments,
} from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/fields-common.schema';
import { getRandomCodeReceiptId } from 'src/utils/generate.code-payment';

export type PaymentStudyFeeDocument = Payment_Study_Fee & Document;

@Schema()
export class Payment_Study_Fee extends FieldsCommonSchema {
  @Prop({
    default: getRandomCodeReceiptId(4),
    required: true,
    unique: true,
  })
  receiptId?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.profiles,
  })
  user?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collectionNames.semesters,
  })
  semester?: mongoose.Types.ObjectId;

  @Prop({ default: 0 })
  totalMoney?: number;

  @Prop({ default: EtypePayments.CASH })
  type?: string;

  @Prop({
    type: {
      description: String,
      bank: String,
      numberAccount: Number,
    },
  })
  paymentOnline?: {
    description?: string;
    bank?: string;
    numberAccount?: number;
  };

  @Prop({ default: EstatusPayments.OWED })
  status?: string;
}

export const PaymentStudyFeeSchema =
  SchemaFactory.createForClass(Payment_Study_Fee);
