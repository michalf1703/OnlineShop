import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateOrderDetailsDto } from './create-order-details.dto';

export class CreateOrderDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested()
    @Type(() => CreateOrderDetailsDto)
    products: CreateOrderDetailsDto[];
}
