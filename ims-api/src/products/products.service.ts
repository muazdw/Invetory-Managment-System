import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ErrorCode } from '../common/constants/error-codes.constants';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    @InjectRepository(Inventory) private inventoryRepo: Repository<Inventory>,
  ) {}

  async create(companyId: string, dto: CreateProductDto) {
    const { supplierId, ...rest } = dto;
    const product = this.repo.create({
      ...rest,
      company: { id: companyId },
      supplier: supplierId ? ({ id: supplierId } as Product['supplier']) : undefined,
    });
    const saved = await this.repo.save(product);
    await this.inventoryRepo.save(
      this.inventoryRepo.create({ product: saved, quantity: 0 }),
    );
    return this.findOne(companyId, saved.id);
  }

  findAll(companyId: string) {
    return this.repo.find({
      where: { company: { id: companyId }, isDeleted: false },
      relations: { supplier: true, inventory: true },
    });
  }

  async findOne(companyId: string, id: string) {
    const p = await this.repo.findOne({
      where: { id, company: { id: companyId }, isDeleted: false },
      relations: { supplier: true, inventory: true },
    });
    if (!p) {
      throw new NotFoundException({
        code: ErrorCode.PRODUCT_NOT_FOUND,
        message: `Product with id ${id} was not found`,
      });
    }
    return p;
  }

  async update(companyId: string, id: string, dto: Partial<CreateProductDto>) {
    const product = await this.findOne(companyId, id);
    const { supplierId, ...rest } = dto;
    Object.assign(product, rest);
    if (supplierId !== undefined) {
      product.supplier = supplierId ? ({ id: supplierId } as Product['supplier']) : null;
    }
    await this.repo.save(product);
    return this.findOne(companyId, id);
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);
    await this.repo.update(id, { isDeleted: true });
    return { message: 'Product deleted' };
  }
}
