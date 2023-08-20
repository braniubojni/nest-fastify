import { MultipartFile } from '@fastify/multipart';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { assign, has } from 'lodash';
import { resolve } from 'node:path';
import { FilesService } from 'src/files/files.service';
import { Post } from './posts.model';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post) private postRepo: typeof Post,
    private fileService: FilesService,
  ) {}

  async create(formData: MultipartFile) {
    // FIXME: Very pure validation
    const dto = ['userId', 'title', 'content'].reduce((acc, key, i) => {
      if (has(formData.fields, key) && has(formData.fields[key], 'value')) {
        acc[key] = formData.fields[key]['value'];
        !i && assign(acc, { [key]: parseInt(acc[key], 10) });
      }
      return acc;
    }, {});
    delete formData.fields;
    const fileName = await this.fileService.create(
      formData,
      resolve(__dirname, '..', 'static', 'posts'),
    );
    console.log({ ...dto, image: fileName });
    const post = await this.postRepo.create({ ...dto, image: fileName });
    return post;
  }
}
