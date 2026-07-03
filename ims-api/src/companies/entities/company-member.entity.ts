import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Company } from './company.entity';
import { CompanyRole } from '../../common/enums/company-role.enum';

@Entity('company_members')
@Unique(['user'])
export class CompanyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Company, (company) => company.members, { onDelete: 'CASCADE' })
  company: Company;

  @Column({ type: 'enum', enum: CompanyRole })
  role: CompanyRole;

  @CreateDateColumn()
  joinedAt: Date;
}
