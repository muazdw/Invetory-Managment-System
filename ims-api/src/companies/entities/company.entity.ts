import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { CompanyMember } from './company-member.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @OneToMany(() => CompanyMember, (member) => member.company)
  members: CompanyMember[];

  @CreateDateColumn()
  createdAt: Date;
}
