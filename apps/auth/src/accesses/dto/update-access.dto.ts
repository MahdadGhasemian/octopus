import { CreateAccessDto } from './create-access.dto';
import { InputType } from '@nestjs/graphql';

@InputType()
export class UpdateAccessDto extends CreateAccessDto {}
