import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { collections } from 'src/constants/constants.collections.name';
import { EuserGender } from 'src/constants/constant';
import { FieldsCommonSchema } from 'src/utils/utils.fields-common.schema';
import { getRandomCodeProfile } from 'src/utils/utils.generate.code';

export type ProfileDocument = Profile & Document;

@Schema({ collection: collections.profiles, versionKey: false })
export class Profile extends FieldsCommonSchema {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.users,
    required: true,
  })
  user: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.class_infos,
  })
  classId?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.faculties,
  })
  faculty?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.majors,
  })
  major?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.courses,
  })
  course?: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: collections.degreelevels,
  })
  degreeLevel?: mongoose.Types.ObjectId; // Formal university, College...

  @Prop({
    maxlength: 15,
    minlength: 6,
    default: getRandomCodeProfile(5),
    unique: true,
  })
  code?: string; // student and lecturer code

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  middleName?: string;

  @Prop()
  avatar?: string;

  @Prop()
  mobile?: string;

  @Prop({ enum: EuserGender, default: EuserGender.MALE })
  gender?: string;

  @Prop()
  dateOfBirth?: Date;

  @Prop()
  joinDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({
    type: Array,
  }) // class president, secretary
  positionHeld?: string[];

  @Prop({
    type: [mongoose.Types.ObjectId],
    ref: collections.awards,
  })
  award?: [mongoose.Types.ObjectId];

  @Prop({
    type: {
      country: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collections.countries,
      },
      province: String,
      state: String,
      permanentAddress: String,
      temporaryAddress: String,
    },
  })
  location?: {
    province: string;
    country: mongoose.Types.ObjectId;
    state: string;
    permanentAddress: string;
    temporaryAddress: string;
  };

  @Prop({
    type: {
      id: String,
      date: Date,
      location: String,
    },
  })
  identityCardNumber?: {
    id?: string;
    date?: Date; // Date range
    location?: string; // place of issue of Id
  };

  @Prop()
  object?: string; // Policy object

  @Prop()
  ethnic?: string;

  @Prop()
  religion?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
