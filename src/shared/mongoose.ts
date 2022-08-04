/**
 * Note: A shared mongoose version without soft deleted feature
 */
import { merge, slice } from 'lodash';
import { ReadPreferenceMode, TransactionOptions } from 'mongodb';
import {
  ClientSession,
  Document,
  Model,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
  Query,
  QueryOptions,
  SaveOptions,
} from 'mongoose';

export function getMaxTimeMs() {
  const maxTimeMs = Number(60000);
  return maxTimeMs || 10000;
}

type BaseFindOptions = QueryOptions;

export interface FindOptions extends BaseFindOptions {
  limit?: number;
  skip?: number;
  maxscan?: number;
  batchSize?: number;
  comment?: string;
  snapshot?: boolean;
  readPreference?: ReadPreferenceMode;
  hint?: Record<string, any>;
}

export type DeleteOptions = QueryOptions;

export interface UpdateOptions extends DeleteOptions {
  multi?: boolean;
  upsert?: boolean;
  setDefaultsOnInsert?: boolean;
  // timestamps?: boolean;
  omitUndefined?: boolean;
  overwrite?: boolean;
  runValidators?: boolean;
  context?: string;
  multipleCastError?: boolean;
}

export interface FindAndDeleteOptions extends BaseFindOptions, DeleteOptions {}

export interface FindAndUpdateOptions
  extends FindAndDeleteOptions,
    UpdateOptions {
  new?: boolean;
  fields?: Record<string, any> | string;
}

export interface Repository<T extends Document> {
  aggregate(aggregations?: any[]): Promise<any[]>;

  aggregatePaginate(pipe: any, query: any);

  count(conditions: any): Promise<number>;

  countAll(): Promise<number>;

  create(doc: Record<string, any>, options?: SaveOptions): Promise<T>;

  create(docs: Record<string, any>[], options?: SaveOptions): Promise<T[]>;

  delete(doc: T, options?: DeleteOptions): Promise<T>;

  delete(docs: T[], options?: DeleteOptions): Promise<T[]>;

  deleteAll(options?: DeleteOptions): Promise<any>;

  deleteById(id: any, options?: FindAndDeleteOptions): Promise<T>;

  deleteMany(conditions: any, options?: DeleteOptions): Promise<any>;

  deleteOne(conditions: any, options?: FindAndDeleteOptions): Promise<T>;

  // exists(conditions: any): Promise<boolean>;

  // existsById(id: any): Promise<boolean>;

  find(conditions: any, options?: FindOptions): Promise<T[]>;

  findAll(options?: FindOptions): Promise<T[]>;

  findById(id: any, options?: any | FindOptions): Promise<T>;

  findOne(conditions: any, options?: FindOptions): Promise<T>;

  findOneOrCreate(
    conditions: any,
    doc: any,
    options?: FindOptions & SaveOptions
  ): Promise<T>;

  save(doc: T, options?: SaveOptions): Promise<T>;

  save(docs: T[], options?: SaveOptions): Promise<T[]>;

  update(conditions: any, doc: any, options?: UpdateOptions): Promise<any>;

  updateById(id: any, doc: any, options?: FindAndUpdateOptions): Promise<T>;

  updateMany(conditions: any, doc: any, options?: UpdateOptions): Promise<any>;

  updateOne(
    conditions: any,
    doc: any,
    options?: FindAndUpdateOptions
  ): Promise<T>;

  updateOneOrCreate(
    conditions: any,
    doc: any,
    options?: FindAndUpdateOptions
  ): Promise<T>;

  withTransaction<U>(
    fn: (session: ClientSession) => Promise<U>,
    option?: TransactionOptions
  ): Promise<U>;

  getCollectionName(): string;

  createCollection(): Promise<void>;

  dropCollection(): Promise<void>;

  getPrimaryKey(): string;
}

export class BaseRepository<T extends Document> implements Repository<T> {
  protected primaryKey = '_id';
  private readonly pagingModel: PaginateModel<T>;

  constructor(public readonly model: Model<T>) {
    this.pagingModel = model as PaginateModel<T>;
  }

  aggregate(aggregations?: any[]): Promise<any[]> {
    aggregations = slice(aggregations);
    const opts = {
      maxTimeMS: getMaxTimeMs(),
    };

    return this.model.aggregate(aggregations).option(opts).exec();
  }

  async count(conditions: any): Promise<number> {
    return this.modifyQuery(this.model.countDocuments(conditions)).exec();
  }

  async countAll(): Promise<number> {
    return this.count({});
  }

  async create(doc: Record<string, any>, options?: SaveOptions): Promise<T>;

  async create(
    docs: Record<string, any>[],
    options?: SaveOptions
  ): Promise<T[]>;

  async create(
    docs: Record<string, any> | Record<string, any>[],
    options?: SaveOptions
  ): Promise<T | T[]> {
    if (Array.isArray(docs)) {
      const result: T[] = [];
      for (const doc of docs) {
        result.push(await this.create(doc, options));
      }
      return result;
    }
    return this.save(new this.model(docs), options);
  }

  async delete(doc: T, options?: DeleteOptions): Promise<T>;

  async delete(docs: T[], options?: DeleteOptions): Promise<T[]>;

  async delete(docs: T | T[], options?: DeleteOptions): Promise<T | T[]> {
    if (Array.isArray(docs)) {
      const result: T[] = [];
      for (const doc of docs) {
        result.push(await this.delete(doc, options));
      }
      return result;
    }
    if (options && options.session) {
      docs.$session(options.session);
    }
    return docs.remove();
  }

  async deleteAll(options?: DeleteOptions): Promise<number> {
    return this.deleteMany({}, options);
  }

  async deleteById(id: any, options?: FindAndDeleteOptions): Promise<T> {
    return this.deleteOne({ [this.primaryKey]: id }, options);
  }

  async deleteMany(conditions: any, options?: DeleteOptions): Promise<number> {
    let query = this.model.deleteMany(conditions);
    if (options && options.session) {
      query = query.session(options.session);
    }
    const result = await query.exec();
    return result.acknowledged ? result.deletedCount : 0;
  }

  async deleteOne(conditions: any, options?: FindAndDeleteOptions): Promise<T> {
    return this.model.findOneAndDelete(conditions, options).exec();
  }

  // async exists(conditions: any): Promise<boolean> {
  //   return this.model.exists(conditions);
  // }

  // async existsById(id: any): Promise<boolean> {
  //   return this.exists({[this.primaryKey]: id});
  // }

  async paginate(
    conditions: any,
    options: PaginateOptions
  ): Promise<PaginateResult<T>> {
    return this.pagingModel.paginate(conditions, options);
  }

  async find(conditions: any, options?: FindOptions): Promise<T[]> {
    return this.modifyQuery(this.model.find(conditions, null, options)).exec();
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return this.find({}, options);
  }

  async findById(id: any, options?: FindOptions): Promise<T> {
    return this.findOne({ [this.primaryKey]: id }, options);
  }

  async findOne(conditions: any, options?: FindOptions): Promise<T> {
    return this.modifyQuery(
      this.model.findOne(conditions, null, options)
    ).exec();
  }

  async findOneOrCreate(
    conditions: any,
    doc: any,
    options?: FindOptions & SaveOptions
  ): Promise<T> {
    let document = await this.findOne(conditions, options);
    if (!document) {
      document = await this.create(merge({}, conditions, doc), options);
    }
    return document;
  }

  async save(doc: T, options?: SaveOptions): Promise<T>;

  async save(docs: T[], options?: SaveOptions): Promise<T[]>;

  async save(docs: T | T[], options?: SaveOptions): Promise<T | T[]> {
    if (Array.isArray(docs)) {
      const result: T[] = [];
      for (const doc of docs) {
        result.push(await this.save(doc, options));
      }
      return result;
    }
    return docs.save(options);
  }

  async update(
    conditions: any,
    doc: any,
    options?: UpdateOptions
  ): Promise<number> {
    const result = await this.modifyQuery(
      this.model.updateMany(conditions, doc, options)
    ).exec();
    return result.acknowledged ? result.matchedCount : 0;
  }

  async updateById(
    id: any,
    doc: any,
    options?: FindAndUpdateOptions
  ): Promise<T> {
    return this.updateOne({ [this.primaryKey]: id }, doc, options);
  }

  async updateMany(
    conditions: any,
    doc: any,
    options?: UpdateOptions
  ): Promise<number> {
    const result = await this.modifyQuery(
      this.model.updateMany(conditions, doc, options)
    ).exec();
    return result.acknowledged ? result.matchedCount : 0;
  }

  async updateOne(
    conditions: any,
    doc: any,
    options?: FindAndUpdateOptions
  ): Promise<T> {
    //@ts-ignore
    return this.modifyQuery(
      this.model.findOneAndUpdate(
        conditions,
        doc,
        merge({ new: true }, options)
      )
    ).exec();
  }
  async updateOneOrCreate(
    conditions: any,
    doc: any,
    options?: FindAndUpdateOptions
  ): Promise<T> {
    return this.updateOne(
      conditions,
      doc,
      merge({ new: true, upsert: true, setDefaultsOnInsert: true }, options)
    );
  }

  async withTransaction<U>(
    fn: (session: ClientSession) => Promise<U>,
    options?: TransactionOptions
  ): Promise<U> {
    const session = await this.model.db.startSession();
    let result: U;
    try {
      await session.withTransaction(async (ses) => {
        result = await fn(ses);
      }, options);
      return result;
    } finally {
      await session.endSession();
    }
  }

  getCollectionName(): string {
    return this.model.collection.collectionName;
  }

  async createCollection(): Promise<void> {
    if (!(await this.isCollectionExists())) {
      await this.model.createCollection();
    }
  }

  async dropCollection(): Promise<void> {
    if (await this.isCollectionExists()) {
      await this.model.collection.drop();
    }
  }

  getPrimaryKey(): string {
    return this.primaryKey;
  }

  private modifyQuery<R, D>(query: Query<R, D>): Query<R, D> {
    // check maxtime ms
    query = query.maxTimeMS(getMaxTimeMs());
    return query;
  }

  private async isCollectionExists(): Promise<boolean> {
    const result = await this.model.db.db
      .listCollections({ name: this.model.collection.collectionName })
      .next();
    return !!result;
  }

  /**
   * Paginate
   * @param {any} model
   * @param {any} pipe
   * @param {any} query
   * @return {Promise<any>}
   */
  async aggregatePaginate(pipe: any, query: any) {
    //this.logger.debug('aggregatePaginate(): match', JSON.stringify(pipe));
    const model: any = this.model;
    const pagingOptions: any = {
      ...query,
      page: query.page,
      limit: query.limit,
      sort: query?.sort,
    };
    if (query.projection) {
      pagingOptions.projection = query.projection;
    }
    return await model.aggregatePaginate(model.aggregate(pipe), pagingOptions);
  }
}
