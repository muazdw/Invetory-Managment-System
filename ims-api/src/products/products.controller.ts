import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RequireCompany } from '../common/decorators/require-company.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@ApiTags('Products')
@ApiBearerAuth()
@RequireCompany()
@UseGuards(AuthGuard('jwt'), CompanyGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles('owner', 'manager')
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateProductDto) {
    return this.productsService.create(user.companyId!, dto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.productsService.findAll(user.companyId!);
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.productsService.findOne(user.companyId!, id);
  }

  @Patch(':id')
  @Roles('owner', 'manager')
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(user.companyId!, id, dto);
  }

  @Delete(':id')
  @Roles('owner')
  remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.productsService.remove(user.companyId!, id);
  }
}
