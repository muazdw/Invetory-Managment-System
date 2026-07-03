import { IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateInventoryDto {
  @ApiProperty()
  @IsUUID('4', { message: 'Product ID must be a valid UUID' })
  productId: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(0, { message: 'Quantity cannot be negative' })
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Low stock threshold must be a number' })
  @Min(0, { message: 'Low stock threshold cannot be negative' })
  lowStockThreshold?: number;
}
