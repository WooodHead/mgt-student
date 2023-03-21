import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { ValidateDto } from 'src/validates/validate.common.dto';
import { CreateInstituteDto } from './dtos/institute.create.dto';
import { UpdateInstituteDto } from './dtos/institute.update.dto';
import { InstitudeDocument, Institudes } from './schemas/institute.schema';

@Injectable()
export class InstituteService {
  constructor(
    @InjectModel(Institudes.name)
    private readonly institutiSchema: Model<InstitudeDocument>,
  ) {}

  async createInstitute(
    instituteDto: CreateInstituteDto,
    createdBy: string,
  ): Promise<Institudes> {
    await this.validateInstituteDto(instituteDto);
    const dto = {
      ...instituteDto,
      createdBy,
    };
    const newInstitute = await new this.institutiSchema(dto).save();
    const result = await this.findInstituteById(newInstitute._id);
    return result;
  }

  async updateInstitute(
    id: string,
    instituteDto: UpdateInstituteDto,
    updatedBy: string,
  ): Promise<Institudes> {
    await this.validateInstituteDto(instituteDto);
    const dto = {
      ...instituteDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    await this.institutiSchema.findByIdAndUpdate(id, dto);
    const result = await this.findInstituteById(id);
    return result;
  }

  async findInstituteById(id: string): Promise<Institudes> {
    const match: Record<string, any> = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = this.lookupInstitute();
    const aggregate = [match, ...lookup];
    const result = await this.institutiSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Institute not found.');
    }
    return result[0];
  }

  async findAllInstitudes(): Promise<Institudes[]> {
    const match = { $match: { isDeleted: false } };
    const lookup = this.lookupInstitute();
    const aggregate = [match, ...lookup];
    const results = await this.institutiSchema.aggregate(aggregate);
    return results;
  }

  async deleteInstitude(id: string, deletedBy: string): Promise<void> {
    await this.findInstituteById(id);
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.institutiSchema.findByIdAndUpdate(id, dto);
  }

  async validateInstituteDto(dtos: CreateInstituteDto): Promise<void> {
    const { parson, viceParson, contacts = {} } = dtos;
    const { office } = contacts;
    const validate = new ValidateDto();
    if (parson) {
      await validate.fieldId(collections.profiles, parson);
    }
    if (viceParson) {
      await validate.fieldId(collections.profiles, viceParson);
    }
    if (office) {
      await validate.fieldId(collections.rooms, office);
    }
  }

  private lookupInstitute() {
    const lookup: any = new LookupCommon([
      {
        from: collections.profiles,
        localField: 'parson',
        foreignField: '_id',
        as: 'parson',
        unwind: true,
      },
      {
        from: collections.profiles,
        localField: 'viceParson',
        foreignField: '_id',
        as: 'viceParson',
        unwind: true,
      },
      {
        from: collections.rooms,
        localField: 'contacts.office',
        foreignField: '_id',
        as: 'office',
        unwind: true,
      },
      {
        from: collections.attachments,
        localField: 'attachment',
        foreignField: '_id',
        as: 'attachment',
        unwind: false,
      },
    ]);
    return lookup;
  }
}
