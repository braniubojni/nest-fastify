import { MultipartFile } from '@fastify/multipart';
import { IsString } from 'class-validator';
import { SHOULD_BE_STRING } from 'src/common/constants/variables';

export class CreatePostDto {
  @IsString({ message: SHOULD_BE_STRING })
  readonly title: string;
  @IsString({ message: SHOULD_BE_STRING })
  readonly content: string;
  readonly userId: number;

  readonly image: MultipartFile[];
}
