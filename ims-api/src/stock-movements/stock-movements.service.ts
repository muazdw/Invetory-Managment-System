import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockMovement, MovementType } from './entities/stock-movement.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { ErrorCode } from '../common/constants/error-codes.constants';
import { ProductsService } from '../products/products.service';

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovement) private movRepo: Repository<StockMovement>,
    @InjectRepository(Inventory) private invRepo: Repository<Inventory>,
    private productsService: ProductsService,
  ) {}

  async stockIn(companyId: string, productId: string, quantity: number, note?: string) {
    await this.productsService.findOne(companyId, productId);

    let inv = await this.invRepo.findOne({ where: { product: { id: productId } } });
    if (!inv) {
      inv = this.invRepo.create({ product: { id: productId } as any, quantity: 0 });
    }
    inv.quantity += quantity;
    await this.invRepo.save(inv);

    const mov = this.movRepo.create({
      product: { id: productId } as any,
      type: MovementType.IN,
      quantity,
      note,
    });
    return this.movRepo.save(mov);
  }

  async stockOut(companyId: string, productId: string, quantity: number, note?: string) {
    await this.productsService.findOne(companyId, productId);

    const inv = await this.invRepo.findOne({ where: { product: { id: productId } } });
    if (!inv || inv.quantity < quantity) {
      const available = inv?.quantity ?? 0;
      throw new BadRequestException({
        code: ErrorCode.INSUFFICIENT_STOCK,
        message: `Insufficient stock for product ${productId}: requested ${quantity}, available ${available}`,
      });
    }
    inv.quantity -= quantity;
    await this.invRepo.save(inv);

    if (inv.quantity <= inv.lowStockThreshold) {
      console.warn(`Low stock alert: product ${productId} has ${inv.quantity} units remaining`);
    }

    const mov = this.movRepo.create({
      product: { id: productId } as any,
      type: MovementType.OUT,
      quantity,
      note,
    });
    return this.movRepo.save(mov);
  }

  getHistory(companyId: string) {
    return this.movRepo.find({
      where: { product: { company: { id: companyId }, isDeleted: false } },
      relations: { product: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getHistoryByProduct(companyId: string, productId: string) {
    await this.productsService.findOne(companyId, productId);
    return this.movRepo.find({
      where: { product: { id: productId, company: { id: companyId } } },
      relations: { product: true },
      order: { createdAt: 'DESC' },
    });
  }
}
