import { MultipartFile } from '@fastify/multipart';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { assign, has } from 'lodash';
import { resolve } from 'node:path';
import { FilesService } from 'src/files/files.service';
import { Post } from './posts.model';
import { CreatePostDto } from './dto/create-post.dto';
import { ALREADY_EXISTS } from 'src/common/constants/functions';
import { APP_MODULES } from 'src/common/constants/enums';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepo: typeof Post,
    private fileService: FilesService,
  ) {}

  async create(formData: MultipartFile) {
    // FIXME: Very pure validation. Body undefined & can't be validated
    const dto: Omit<CreatePostDto, 'image'> = [
      'userId',
      'title',
      'content',
    ].reduce(
      (acc, key, i) => {
        if (has(formData.fields, key) && has(formData.fields[key], 'value')) {
          acc[key] = formData.fields[key]['value'];
          !i && assign(acc, { [key]: parseInt(acc[key], 10) });
        }
        return acc;
      },
      { userId: 1, title: '', content: '' },
    );
    delete formData.fields;
    const postExists = await this.postRepo.findOne({
      where: { title: dto.title },
    });
    if (postExists) {
      throw new HttpException(
        ALREADY_EXISTS(APP_MODULES._POST),
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileName = await this.fileService.create(
      formData,
      resolve(__dirname, '..', 'static', 'posts'),
    );
    const post = await this.postRepo.create({ ...dto, image: fileName });
    return post;
  }
}
