import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private readonly maxSize: number) {}

  transform(file: any) {
    if (file.size > this.maxSize) {
      throw new BadRequestException('File size is too large');
    }
    return file;
  }
}
