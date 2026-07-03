import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CompanyRole } from '../../common/enums/company-role.enum';

export class CompanyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  address?: string;

  @ApiProperty()
  createdAt: Date;
}

export class CreateCompanyResponseDto extends CompanyResponseDto {
  @ApiProperty({ description: 'JWT with company and owner role claims' })
  access_token: string;
}

export class MemberResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: CompanyRole })
  role: CompanyRole;

  @ApiProperty()
  joinedAt: Date;
}
