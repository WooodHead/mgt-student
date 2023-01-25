import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
  @Prop({
    // k12
    type: String,
    required: true,
  })
  name?: string;

  @Prop()
  year?: string; // 2016-2017

  @Prop()
  total?: number;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'faculties',
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop()
  trainingTime?: {
    maximum?: number; // 7 year
    minimum?: number; // 3 year
  };

  @Prop({
    subject: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'subjects',
    },
  })
  schedule?: [
    {
      semester?: mongoose.Schema.Types.ObjectId;
      subject?: [mongoose.Types.ObjectId]; // [Nhap Mon Lap Trinh]
    },
  ];

  @Prop()
  output?: {
    toeic?: string; // 400, 450, 500 ...
    it?: string;
    conditionDiff?: string; // GDTC, GDQP ...
  };

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updateAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
