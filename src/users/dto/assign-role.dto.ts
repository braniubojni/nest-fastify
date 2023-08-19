import { IsNumber, IsString } from 'class-validator';
import {
  SHOULD_BE_NUMBER,
  SHOULD_BE_STRING,
} from 'src/common/constants/variables';

export class AssignRoleDto {
  @IsString({ message: SHOULD_BE_STRING })
  readonly value: string;
  @IsNumber({}, { message: SHOULD_BE_NUMBER })
  readonly userId: number;
}
