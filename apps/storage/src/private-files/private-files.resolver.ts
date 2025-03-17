import { PrivateFilesService } from './private-files.service';
import { CurrentUser, JwtAuthAccessGuard } from '@app/common';
import { User } from '../libs';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphqlUploadPrivateFileResponseDto } from './dto/graphql-upload-private-file-response.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class PrivateFilesResolver {
  constructor(private readonly privateFilesService: PrivateFilesService) {}

  @Mutation(() => GraphqlUploadPrivateFileResponseDto, {
    name: 'uploadPrivateFile',
  })
  @UseGuards(JwtAuthAccessGuard)
  async uploadFile(
    @CurrentUser() user: User,
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Args({ name: 'description', type: () => String, nullable: true })
    description: string,
  ) {
    return this.privateFilesService.uploadFile(file, description, user);
  }
}
