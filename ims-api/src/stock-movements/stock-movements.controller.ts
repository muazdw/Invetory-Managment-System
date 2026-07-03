import { Controller, Post, Get, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam } from '@nestjs/swagger';
import { StockMovementsService } from './stock-movements.service';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequireCompany } from '../common/decorators/require-company.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@ApiTags('Stock Movements')
@ApiBearerAuth()
@RequireCompany()
@UseGuards(AuthGuard('jwt'), CompanyGuard, RolesGuard)
@Controller('stock')
export class StockMovementsController {
  constructor(private stockService: StockMovementsService) {}

  @Post('in')
  @Roles('owner', 'manager')
  stockIn(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStockMovementDto) {
    return this.stockService.stockIn(user.companyId!, dto.productId, dto.quantity, dto.note);
  }

  @Post('out')
  @Roles('owner', 'manager')
  stockOut(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateStockMovementDto) {
    return this.stockService.stockOut(user.companyId!, dto.productId, dto.quantity, dto.note);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get stock movement history for all products' })
  getHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.stockService.getHistory(user.companyId!);
  }

  @Get('history/:productId')
  @ApiOperation({ summary: 'Get stock movement history for a specific product' })
  @ApiParam({ name: 'productId', description: 'Product UUID' })
  getHistoryByProduct(
    @CurrentUser() user: AuthenticatedUser,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.stockService.getHistoryByProduct(user.companyId!, productId);
  }
}
