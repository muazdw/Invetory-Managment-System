import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { ErrorCode } from '../common/constants/error-codes.constants';

@Injectable()
export class InventoryService {
  constructor(@InjectRepository(Inventory) private repo: Repository<Inventory>) {}

  findAll(companyId: string) {
    return this.repo.find({
      where: { product: { company: { id: companyId }, isDeleted: false } },
      relations: { product: true },
    });
  }

  async update(companyId: string, dto: UpdateInventoryDto) {
    const inv = await this.repo.findOne({
      where: {
        product: { id: dto.productId, company: { id: companyId }, isDeleted: false },
      },
    });
    if (!inv) {
      throw new NotFoundException({
        code: ErrorCode.INVENTORY_NOT_FOUND,
        message: `Inventory record for product ${dto.productId} was not found`,
      });
    }
    inv.quantity = dto.quantity;
    if (dto.lowStockThreshold !== undefined) inv.lowStockThreshold = dto.lowStockThreshold;
    return this.repo.save(inv);
  }
}
