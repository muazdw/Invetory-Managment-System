import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { Inventory } from '../../inventory/entities/inventory.entity';
import { StockMovement } from '../../stock-movements/entities/stock-movement.entity';
import { Company } from '../../companies/entities/company.entity';
import { Exclude } from 'class-transformer';

@Entity('products')
@Unique(['company', 'sku'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sku: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  unitPrice: number;

  @Exclude()
  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  supplier: Supplier | null;

  @OneToOne(() => Inventory, (inventory) => inventory.product)
  inventory: Inventory;

  @OneToMany(() => StockMovement, (movement) => movement.product)
  stockMovements: StockMovement[];
}
