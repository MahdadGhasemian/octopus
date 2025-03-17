import { PublicFilesService } from './public-files.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GraphqlUploadPublicFileResponseDto } from './dto/graphql-upload-public-file-response.dto';
import { FileUpload, GraphQLUpload } from 'graphql-upload-minimal';

@Resolver()
export class PublicFilesResolver {
  constructor(private readonly publicFilesService: PublicFilesService) {}

  @Mutation(() => GraphqlUploadPublicFileResponseDto, {
    name: 'uploadPublicFile',
  })
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
  ) {
    return this.publicFilesService.uploadFile(file);
  }
}
