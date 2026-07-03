import { IsUUID, IsNumber, IsOptional, IsString, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockMovementDto {
  @ApiProperty()
  @IsUUID('4', { message: 'Product ID must be a valid UUID' })
  productId: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be greater than zero' })
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Note must be a string' })
  note?: string;
}
