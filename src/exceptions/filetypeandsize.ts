import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import * as multer from 'multer';

@Injectable()
export class FileValidationPipe implements PipeTransform<any> {

    async transform(value: any) {
        if (value) {
            const file: Express.Multer.File = value;
            const allowedTypes = ['image/jpeg','image/png']; // Add more types if needed
            const maxSizeInBytes = 1 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(file.mimetype)) {
                throw new BadRequestException('File must be in JPEG format');
            }

            if (file.size > maxSizeInBytes) {
                throw new BadRequestException('File size exceeds 1MB');
            }
        }
        return value;
    }
}
