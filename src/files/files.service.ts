import { MultipartFile } from '@fastify/multipart';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { INVALID } from 'src/common/constants/functions';
import { IMG_MIME, WRITE_FILE_ERR } from 'src/common/constants/variables';
import { UtilsService } from 'src/utils/utils.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(private readonly utils: UtilsService) {}

  async create(file: MultipartFile, folder: string): Promise<string> {
    try {
      const { mimetype, data } = file as any;
      const [, ext] = mimetype.split('/');
      const rStream = Readable.from(data);
      if (!IMG_MIME.has(ext)) {
        throw new HttpException(INVALID('File type'), HttpStatus.CONFLICT);
      }
      const fileName = `${uuid()}.${ext}`;
      if (!existsSync(folder)) {
        await mkdir(folder);
      }
      await this.utils.pipeline(rStream, join(folder, fileName));
      return fileName;
    } catch (e) {
      Logger.error(e.message);
      throw new HttpException(WRITE_FILE_ERR, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
