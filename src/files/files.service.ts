import { MultipartFile } from '@fastify/multipart';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { INVALID } from 'src/common/constants/functions';
import { IMG_MIME, WRITE_FILE_ERR } from 'src/common/constants/variables';
import { UtilsService } from 'src/utils/utils.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(private readonly utils: UtilsService) {}

  async create(File: MultipartFile, folder: string): Promise<string> {
    try {
      const { mimetype, file } = File;
      const [, ext] = mimetype.split('/');
      if (!IMG_MIME.has(ext)) {
        throw new HttpException(INVALID('File type'), HttpStatus.CONFLICT);
      }
      const fileName = `${uuid()}.${ext}`;
      if (!existsSync(folder)) {
        await mkdir(folder, { recursive: true });
      }
      await this.utils.pipeline(file, join(folder, fileName));
      return fileName;
    } catch (e) {
      Logger.error(e.message);
      throw new HttpException(WRITE_FILE_ERR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
