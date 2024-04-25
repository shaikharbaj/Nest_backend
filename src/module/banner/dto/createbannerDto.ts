import { IsNotEmpty } from 'class-validator'
export class createBannerDTO {

    @IsNotEmpty()
    title: string
    @IsNotEmpty()
    description: string
    @IsNotEmpty()
    start_date: Date
    @IsNotEmpty()
    end_date: Date
}