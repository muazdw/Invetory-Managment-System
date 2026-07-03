import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { CompanyRole } from '../../common/enums/company-role.enum';

export class AddMemberDto {
  @ApiProperty({ example: 'employee@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: CompanyRole, example: CompanyRole.VIEWER, default: CompanyRole.VIEWER })
  @IsOptional()
  @IsEnum(CompanyRole)
  role?: CompanyRole;
}
