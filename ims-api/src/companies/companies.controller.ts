import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import {
  CompanyResponseDto,
  CreateCompanyResponseDto,
  MemberResponseDto,
} from './dto/company-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags('Companies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(
    private companiesService: CompaniesService,
    private authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a company and become its owner' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCompanyDto,
  ): Promise<CreateCompanyResponseDto> {
    return this.companiesService.create(user.id, dto).then(async (company) => ({
      id: company.id,
      name: company.name,
      address: company.address ?? undefined,
      createdAt: company.createdAt,
      access_token: await this.authService.issueToken(user.id),
    }));
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the current user company' })
  getMyCompany(@CurrentUser() user: AuthenticatedUser): Promise<CompanyResponseDto> {
    return this.companiesService.getMyCompany(user);
  }

  @Get('members')
  @Roles('owner')
  @ApiOperation({ summary: 'List company members (owner only)' })
  listMembers(@CurrentUser() user: AuthenticatedUser): Promise<MemberResponseDto[]> {
    return this.companiesService.listMembers(user);
  }

  @Post('members')
  @Roles('owner')
  @ApiOperation({ summary: 'Add an employee to the company (owner only)' })
  addMember(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: AddMemberDto,
  ): Promise<MemberResponseDto> {
    return this.companiesService.addMember(user, dto);
  }

  @Patch('members/:userId')
  @Roles('owner')
  @ApiOperation({ summary: 'Update a member role (owner only)' })
  updateMemberRole(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
    @Body() dto: UpdateMemberRoleDto,
  ): Promise<MemberResponseDto> {
    return this.companiesService.updateMemberRole(user, userId, dto);
  }

  @Delete('members/:userId')
  @Roles('owner')
  @ApiOperation({ summary: 'Remove a member from the company (owner only)' })
  removeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
  ) {
    return this.companiesService.removeMember(user, userId);
  }
}
