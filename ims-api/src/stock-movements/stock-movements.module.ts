import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockMovement } from './entities/stock-movement.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { StockMovementsService } from './stock-movements.service';
import { StockMovementsController } from './stock-movements.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [TypeOrmModule.forFeature([StockMovement, Inventory]), ProductsModule],
  providers: [StockMovementsService],
  controllers: [StockMovementsController],
})
export class StockMovementsModule {}