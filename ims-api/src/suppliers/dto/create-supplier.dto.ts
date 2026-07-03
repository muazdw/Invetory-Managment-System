import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty()
  @IsString({ message: 'Supplier name must be a string' })
  @IsNotEmpty({ message: 'Supplier name is required' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Supplier email must be a valid email address' })
  @IsNotEmpty({ message: 'Supplier email is required' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'Supplier phone must be a string' })
  @IsNotEmpty({ message: 'Supplier phone is required' })
  phone: string;
}
