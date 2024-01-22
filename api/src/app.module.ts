import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search/search.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_URL } from './config';

@Module({
  imports: [SearchModule, MongooseModule.forRoot(MONGO_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
