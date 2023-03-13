import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { LookupCommon } from 'src/utils/lookup.query.aggregate-query';
import { QueryService } from 'src/utils/query.service';
import { CreateUnionDto } from './dtos/unions.create.dto';
import { UpdateUnionDto } from './dtos/unions.update.dto';
import { Union, UnionDocument } from './schemas/unions.schema';

@Injectable()
export class UnionsService {
  constructor(
    @InjectModel(Union.name) private readonly unionSchema: Model<UnionDocument>,
  ) {}

  async validateUnionDto(
    unionDto: CreateUnionDto,
  ): Promise<Record<string, any>> {
    const queryService = new QueryService();
    const { images = [], members = [] } = unionDto;
    if (images.length > 0) {
      const imageLists = [];
      for (const item of images) {
        const options = { _id: new Types.ObjectId(item.attachment) };
        const result = await queryService.findOneByOptions(
          'attachments',
          options,
        );
        if (result) {
          imageLists.push(item);
        }
      }
      unionDto.images = imageLists;
    }
    if (members.length > 0) {
      const memberLists = [];
      for (const item of members) {
        const options = { _id: new Types.ObjectId(item.user) };
        const result = await queryService.findOneByOptions('profiles', options);
        if (result) {
          memberLists.push(item);
        }
      }
      unionDto.members = memberLists;
    }
    return unionDto;
  }

  async createUnion(unionDto: CreateUnionDto): Promise<Union> {
    const newDto = await this.validateUnionDto(unionDto);
    const union = await new this.unionSchema(newDto).save();
    const result = await this.findUnionById(union._id);
    return result;
  }

  async findUnionById(id: string): Promise<Union> {
    const match = { $match: { _id: new Types.ObjectId(id) } };
    const lookup = this.lookupUnion();
    const aggregate = [match, ...lookup];
    const result = await this.unionSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, 'Union not found.');
    }
    return result[0];
  }

  async updateUnion(id: string, unionDto: UpdateUnionDto): Promise<Union> {
    const newDto = await this.validateUnionDto(unionDto);
    await this.unionSchema.findByIdAndUpdate(id, newDto);
    const result = await this.findUnionById(id);
    return result;
  }

  async findAllUnions(): Promise<Union[]> {
    const lookup = this.lookupUnion();
    const results = await this.unionSchema.aggregate(lookup);
    return results;
  }

  private lookupUnion() {
    const lookup: any = new LookupCommon([
      {
        from: 'profiles',
        localField: 'members.user',
        foreignField: '_id',
        as: 'user',
        unwind: true,
      },
      {
        from: 'attachments',
        localField: 'images.attachment',
        foreignField: '_id',
        as: 'attachment',
        unwind: true,
      },
    ]);
    return lookup;
  }
}
