import { MultipartFile } from '@fastify/multipart';
import { IsNumber, IsString, ValidationError } from 'class-validator';
import { INVALID } from 'src/common/constants/functions';
import {
  SHOULD_BE_NUMBER,
  SHOULD_BE_STRING,
} from 'src/common/constants/variables';

export class CreatePostDto {
  @IsString({ message: SHOULD_BE_STRING })
  title: string;
  @IsString({ message: SHOULD_BE_STRING })
  content: string;
  @IsNumber({}, { message: SHOULD_BE_NUMBER })
  userId: number;

  readonly image: MultipartFile[];
}
