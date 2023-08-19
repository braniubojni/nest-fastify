import { BusboyFileStream } from '@fastify/busboy';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { createWriteStream } from 'node:fs';
import { Readable, pipeline } from 'node:stream';
import * as util from 'node:util';

@Injectable()
export class UtilsService {
  async allSettled(promises: Promise<any>[], silent = false): Promise<any[]> {
    const settledResult = await Promise.allSettled(promises);
    const rejected = settledResult.filter(
      (rej): rej is PromiseRejectedResult => rej.status === 'rejected',
    );
    if (!silent && rejected.length) {
      rejected.forEach(({ reason }) => {
        Logger.error(reason);
      });
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: 'Please contact to support team',
      });
    }
    return settledResult
      .filter(
        (fulf): fulf is PromiseFulfilledResult<any> =>
          fulf.status === 'fulfilled',
      )
      .map(({ value }) => value as any);
  }

  async pipeline(file: BusboyFileStream | Readable, path: string) {
    const pump = util.promisify(pipeline);
    return pump(file, createWriteStream(path));
  }
}
