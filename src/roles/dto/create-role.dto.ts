import { IsString } from 'class-validator';
import { SHOULD_BE_STRING } from 'src/common/constants/variables';

export class CreateRoleDto {
  @IsString({ message: SHOULD_BE_STRING })
  readonly value: string;
  @IsString({ message: SHOULD_BE_STRING })
  readonly description: string;
}
