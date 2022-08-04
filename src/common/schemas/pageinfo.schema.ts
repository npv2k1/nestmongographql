import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field()
  totalDocs: number;
  @Field()
  limit: number;
  @Field()
  page: number;
  @Field()
  totalPages: number;
  @Field()
  pagingCounter: number;
  @Field()
  hasPrevPage: boolean;
  @Field()
  hasNextPage: boolean;
  @Field()
  prevPage: number | null;
  @Field()
  nextPage: number | null;
}
