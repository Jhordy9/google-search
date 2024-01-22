import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SearchDocument = HydratedDocument<Search>;

@Schema({ collection: 'results' })
export class Search {
  @Prop({ _id: true })
  _id: string;

  @Prop()
  title: number;

  @Prop()
  link: string;

  @Prop()
  snippet: string;

  @Prop()
  keyword: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const SearchSchema = SchemaFactory.createForClass(Search);
