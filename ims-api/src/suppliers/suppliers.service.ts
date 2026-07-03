import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from './entities/supplier.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { ErrorCode } from '../common/constants/error-codes.constants';
import { ErrorMessage } from '../common/constants/error-messages.constants';

@Injectable()
export class SuppliersService {
  constructor(@InjectRepository(Supplier) private repo: Repository<Supplier>) {}

  async create(companyId: string, dto: CreateSupplierDto) {
    if (dto.email) {
      const existing = await this.repo.findOne({
        where: { email: dto.email, company: { id: companyId } },
      });
      if (existing) {
        throw new ConflictException({
          code: ErrorCode.EMAIL_ALREADY_EXISTS,
          message: ErrorMessage[ErrorCode.EMAIL_ALREADY_EXISTS],
        });
      }
    }
    const supplier = this.repo.create({ ...dto, company: { id: companyId } });
    return this.repo.save(supplier);
  }

  findAll(companyId: string) {
    return this.repo
      .find({
        where: { company: { id: companyId } },
        relations: { products: { inventory: true } },
      })
      .then((suppliers) => suppliers.map((s) => this.filterActiveProducts(s)));
  }

  async findOne(companyId: string, id: string) {
    const s = await this.repo.findOne({
      where: { id, company: { id: companyId } },
      relations: { products: { inventory: true } },
    });
    if (!s) {
      throw new NotFoundException({
        code: ErrorCode.SUPPLIER_NOT_FOUND,
        message: `Supplier with id ${id} was not found`,
      });
    }
    return this.filterActiveProducts(s);
  }

  private filterActiveProducts<T extends { products?: { isDeleted?: boolean }[] }>(supplier: T): T {
    if (supplier.products) {
      supplier.products = supplier.products.filter((p) => !p.isDeleted);
    }
    return supplier;
  }

  async update(companyId: string, id: string, dto: Partial<CreateSupplierDto>) {
    await this.findOne(companyId, id);
    await this.repo.update(id, dto);
    return this.findOne(companyId, id);
  }

  async remove(companyId: string, id: string) {
    await this.findOne(companyId, id);
    await this.repo.delete(id);
    return { message: 'Supplier deleted successfully' };
  }
}
