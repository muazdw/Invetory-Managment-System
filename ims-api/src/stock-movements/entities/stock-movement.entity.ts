import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export enum MovementType {
  IN = 'in',
  OUT = 'out',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.stockMovements)
  product: Product;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;
}