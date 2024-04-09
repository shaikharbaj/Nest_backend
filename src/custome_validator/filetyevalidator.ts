import { BadRequestException } from "@nestjs/common";

export class FileTypeValidator {
    constructor(private readonly options: { fileType: string }) { }

    validate(file: Express.Multer.File) {
        if (file.mimetype !== this.options.fileType) {
            throw new BadRequestException('Invalid file type');
        }
        return true;
    }
}