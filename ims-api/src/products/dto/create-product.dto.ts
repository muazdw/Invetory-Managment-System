import { IsString, IsNumber, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString({ message: 'SKU must be a string' })
  @IsNotEmpty({ message: 'SKU is required' })
  sku: string;

  @ApiProperty()
  @IsString({ message: 'Product name must be a string' })
  @IsNotEmpty({ message: 'Product name is required' })
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Unit price must be a number' })
  unitPrice: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID('4', { message: 'Supplier ID must be a valid UUID' })
  supplierId?: string;
}
