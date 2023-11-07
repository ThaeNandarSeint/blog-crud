import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  ILike,
  Repository,
} from 'typeorm';
import { Posts } from './entities/post.entity';
import { GetPostsDto } from './dto/get-posts.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectRepository(Posts) private repository: Repository<Posts>) {}

  async create(data: DeepPartial<Posts>) {
    const customer = this.repository.create(data);
    return await this.repository.save(customer);
  }

  async update(id: number, data: DeepPartial<Posts>) {
    await this.repository.update(id, data);
    return this.repository.findOneBy({ id });
  }

  async delete(id: number) {
    return await this.repository.delete(id);
  }

  async findAll({ search, skip, limit }: GetPostsDto) {
    // eslint-disable-next-line prefer-const
    let where: FindManyOptions<Posts>['where'] = [];

    if (search) {
      where.push({
        title: ILike(`%${search}%`),
      });
    }

    const [data, count] = await this.repository.findAndCount({
      where,
      skip,
      take: limit,
    });
    return { data, count };
  }

  async findById(id: number) {
    const post = await this.repository.findOneBy({ id });
    if (!post) {
      throw new BadRequestException('This post does not exist.');
    }
    return post;
  }

  async findOne(where: FindOneOptions<Posts>['where']) {
    return await this.repository.findOne({ where });
  }
}
