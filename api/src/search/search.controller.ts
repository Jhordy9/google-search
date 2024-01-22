import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async getSearchResults(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('keyword') keyword: string,
  ) {
    return await this.searchService.getSearchResults(page, limit, keyword);
  }

  @Post()
  createSearchResult(@Body() data: { keyword: string }) {
    return this.searchService.createSearchResult(data.keyword);
  }
}
