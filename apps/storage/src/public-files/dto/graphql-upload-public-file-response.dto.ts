import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { IsNumber, IsString, IsUrl } from 'class-validator';

@ObjectType()
export class GraphqlUploadPublicFileResponseDto {
  @IsString()
  @Expose()
  @Field(() => String, { nullable: true })
  bucket_name: string;

  @IsString()
  @Expose()
  @Field(() => String, { nullable: true })
  object_name: string;

  @IsNumber()
  @Expose()
  @Field(() => Int, { nullable: true })
  size: number;

  @IsString()
  @IsUrl()
  @Expose()
  @Field(() => String, { nullable: true })
  url: string;
}
