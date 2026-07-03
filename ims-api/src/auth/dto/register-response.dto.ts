import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyRole } from '../../common/enums/company-role.enum';

export class RegisterCompanyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  address?: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ type: RegisterCompanyDto })
  company: RegisterCompanyDto;

  @ApiProperty({ enum: CompanyRole, example: CompanyRole.OWNER })
  role: CompanyRole;

  @ApiProperty({ description: 'JWT with company and owner role claims' })
  access_token: string;

  @ApiProperty({ example: '2026-05-24T12:00:00.000Z' })
  createdAt: Date;
}
