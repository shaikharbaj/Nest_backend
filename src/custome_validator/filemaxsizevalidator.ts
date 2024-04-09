import { BadRequestException } from '@nestjs/common';

export class MaxFileSizeValidator {
  constructor(private readonly options: { maxSize: number }) {}

  validate(file: Express.Multer.File) {
    if (file.size > this.options.maxSize) {
      throw new BadRequestException('File size exceeds the maximum limit');
    }
    return true;
  }
}