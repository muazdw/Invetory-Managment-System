import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequireCompany } from '../common/decorators/require-company.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@ApiTags('Suppliers')
@ApiBearerAuth()
@RequireCompany()
@UseGuards(AuthGuard('jwt'), CompanyGuard, RolesGuard)
@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Post()
  @Roles('owner', 'manager')
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(user.companyId!, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.suppliersService.findAll(user.companyId!);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.suppliersService.findOne(user.companyId!, id);
  }

  @Patch(':id')
  @Roles('owner', 'manager')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: Partial<CreateSupplierDto>,
  ) {
    return this.suppliersService.update(user.companyId!, id, dto);
  }

  @Delete(':id')
  @Roles('owner')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.suppliersService.remove(user.companyId!, id);
  }
}
