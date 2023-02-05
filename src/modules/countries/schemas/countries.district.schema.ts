import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type DistrictDocument = Districts & Document;

@Schema()
export class Districts {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'countries',
    required: true,
  })
  countryId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'provinces',
    required: true,
  })
  provinceId: mongoose.Types.ObjectId;

  @Prop()
  phoneCode?: string;

  @Prop()
  codename?: string;

  @Prop()
  code?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const DistrictSchema = SchemaFactory.createForClass(Districts);