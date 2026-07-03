import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Unique } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('suppliers')
@Unique(['company', 'email'])
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  company: Company;

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];
}
