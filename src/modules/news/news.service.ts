import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { collections } from 'src/constants/collections.name';
import { msgNotFound } from 'src/constants/message.response';
import { CommonException } from 'src/exceptions/exeception.common-error';
import { newsLookup } from 'src/utils/utils.lookup.query.service';
import { skipLimitAndSortPagination } from 'src/utils/utils.page.pagination';
import { ValidateDto } from 'src/validates/validates.common.dto';
import { CreateNewDto } from './dtos/news.create.dto';
import { QueryNewDto } from './dtos/news.query.dto';
import { UpdateNewDto } from './dtos/news.update.dto';
import { ImatchFindNews } from './interfaces/news.find.match.interface';
import { News, NewsDocument } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name)
    private readonly newsSchema: Model<NewsDocument>,
  ) {}

  async createNews(
    createNewDto: CreateNewDto,
    createdBy: string,
  ): Promise<News> {
    const { attachment = [] } = createNewDto;
    const attachmentIds = await new ValidateDto().idLists(
      collections.attachments,
      attachment,
    );
    const dto = {
      ...createNewDto,
      attachment: attachmentIds,
      createdBy,
    };
    const news = await new this.newsSchema(dto).save();
    const result = await this.findNewsById(news._id);
    return result;
  }

  async findNewsById(id: string): Promise<News> {
    const match: ImatchFindNews = {
      $match: { _id: new Types.ObjectId(id) },
    };
    const lookup = newsLookup();
    const aggregate = [match, ...lookup];
    const result = await this.newsSchema.aggregate(aggregate);
    if (!result[0]) {
      new CommonException(404, msgNotFound);
    }
    return result[0];
  }

  async findAllNews(query: QueryNewDto): Promise<News[]> {
    const { limit, page, type } = query;
    const match: ImatchFindNews = { $match: { isDeleted: false } };
    if (type) {
      match.$match.type = type;
    }
    const aggPagination = skipLimitAndSortPagination(limit, page);
    const lookup = newsLookup();
    const aggregate = [match, ...aggPagination, ...lookup];
    const results = await this.newsSchema.aggregate(aggregate);
    return results;
  }

  async updateNews(
    id: string,
    updateDto: UpdateNewDto,
    updatedBy: string,
  ): Promise<News> {
    const { attachment = [] } = updateDto;
    if (attachment.length > 0) {
      const attachmentIds = await new ValidateDto().idLists(
        collections.attachments,
        attachment,
      );
      updateDto.attachment = attachmentIds;
    }
    const dto = {
      ...updateDto,
      updatedBy,
      updatedAt: Date.now(),
    };
    const getNew = await this.newsSchema.findByIdAndUpdate(id, dto, {
      new: true,
    });

    return getNew;
  }

  async deleteNews(id: string, deletedBy: string): Promise<void> {
    await this.findNewsById(id);
    const dto = {
      isDeleted: true,
      deletedBy,
      deletedAt: Date.now(),
    };
    await this.newsSchema.findByIdAndUpdate(id, dto);
  }
}
