import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { CompanyRole } from '../../common/enums/company-role.enum';

export class UpdateMemberRoleDto {
  @ApiProperty({ enum: [CompanyRole.MANAGER, CompanyRole.VIEWER] })
  @IsEnum(CompanyRole)
  role: CompanyRole.MANAGER | CompanyRole.VIEWER;
}
