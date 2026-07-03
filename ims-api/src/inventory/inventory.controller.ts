import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequireCompany } from '../common/decorators/require-company.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@ApiTags('Inventory')
@ApiBearerAuth()
@RequireCompany()
@UseGuards(AuthGuard('jwt'), CompanyGuard, RolesGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.inventoryService.findAll(user.companyId!);
  }

  @Patch('update')
  @Roles('owner', 'manager')
  update(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(user.companyId!, dto);
  }
}
