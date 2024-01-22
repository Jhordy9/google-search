import { Inject, Injectable, Logger } from '@nestjs/common';
import { Search } from './result.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';

type SearchResultsResponse = {
  info: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    nextPage: number | null;
    prevPage: number | null;
  };
  results: Search[];
};

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectModel(Search.name) private searchModel: Model<Search>,
    @Inject('SEARCH_SERVICE') private client: ClientProxy,
  ) {}

  async getSearchResults(
    page: number = 1,
    limit: number = 10,
    keyWordFilter?: string,
  ): Promise<SearchResultsResponse> {
    const skip = (page - 1) * limit;

    const filter = keyWordFilter
      ? { keyword: keyWordFilter.toLowerCase() }
      : {};

    const [results, totalRecords] = await Promise.all([
      this.searchModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.searchModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return {
      info: {
        currentPage: page,
        totalPages,
        totalRecords,
        nextPage,
        prevPage,
      },
      results,
    };
  }

  createSearchResult(keyWord: string): void {
    const record = new RmqRecordBuilder(keyWord.toLowerCase()).build();

    this.client.emit('search-queue', record).subscribe({
      complete: () => this.logger.log('Add message with payload: ' + keyWord),
    });
  }
}
