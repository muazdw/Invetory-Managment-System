import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, (product) => product.inventory)
  @JoinColumn()
  product: Product;

  @Column({ default: 0 })
  quantity: number;

  @Column({ default: 10 })
  lowStockThreshold: number;
}