import { Module } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CompanyGuard } from './guards/company.guard';

@Module({
  providers: [JwtAuthGuard, RolesGuard, CompanyGuard],
  exports: [JwtAuthGuard, RolesGuard, CompanyGuard],
})
export class CommonModule {}
