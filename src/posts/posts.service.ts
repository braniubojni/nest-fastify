import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { resolve } from 'node:path';
import { FilesService } from 'src/files/files.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepo: typeof Post,
    private fileService: FilesService,
  ) {}

  async create(dto: CreatePostDto) {
    const fileName = await this.fileService.create(
      dto.image[0],
      resolve(__dirname, '..', 'static', 'posts'),
    );
    const post = await this.postRepo.create({ ...dto, image: fileName });
    return post;
  }
}
