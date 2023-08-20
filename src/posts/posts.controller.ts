import { Controller, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  async create(@Req() req: FastifyRequest) {
    const data = await req.file();

    return this.postService.create(data);
  }
}
