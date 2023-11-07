import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsRepository } from './posts.repository';
import { GetPostsDto } from './dto/get-posts.dto';

@Injectable()
export class PostsService {
  constructor(private postsRepository: PostsRepository) {}

  async create(data: CreatePostDto) {
    const existingPost = await this.findByTitle(data.title);
    if (existingPost) {
      throw new BadRequestException('This title already exits');
    }

    return await this.postsRepository.create(data);
  }

  async findAll(query: GetPostsDto) {
    return await this.postsRepository.findAll(query);
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new BadRequestException('This post does not exit.');
    }

    return post;
  }

  async update(id: number, data: UpdatePostDto) {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new BadRequestException('This post does not exit.');
    }

    const existingPost = await this.findByTitle(data.title);
    if (existingPost) {
      throw new BadRequestException('This title already exits');
    }

    return await this.postsRepository.update(id, data);
  }

  async remove(id: number) {
    const post = await this.postsRepository.findById(id);

    if (!post) {
      throw new BadRequestException('This post does not exit.');
    }

    await this.postsRepository.delete(id);

    return { message: 'Deleted!' };
  }

  async findByTitle(title: string) {
    return await this.postsRepository.findOne({ title });
  }
}
