import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Company } from './entities/company.entity';
import { CompanyMember } from './entities/company-member.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { UsersService } from '../users/users.service';
import { CompanyRole } from '../common/enums/company-role.enum';
import { ErrorCode } from '../common/constants/error-codes.constants';
import { ErrorMessage } from '../common/constants/error-messages.constants';
import { AuthenticatedUser } from '../common/interfaces/authenticated-user.interface';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(CompanyMember) private memberRepo: Repository<CompanyMember>,
    private usersService: UsersService,
  ) {}

  async findMembershipByUserId(userId: string) {
    return this.memberRepo.findOne({
      where: { user: { id: userId } },
      relations: { company: true, user: true },
    });
  }

  async create(userId: string, dto: CreateCompanyDto) {
    const existing = await this.findMembershipByUserId(userId);
    if (existing) {
      throw new ConflictException({
        code: ErrorCode.ALREADY_IN_COMPANY,
        message: ErrorMessage[ErrorCode.ALREADY_IN_COMPANY],
      });
    }

    const company = await this.companyRepo.save(
      this.companyRepo.create({ name: dto.name, address: dto.address }),
    );
    await this.memberRepo.save(
      this.memberRepo.create({
        user: { id: userId },
        company,
        role: CompanyRole.OWNER,
      }),
    );

    return company;
  }

  async getMyCompany(user: AuthenticatedUser) {
    if (!user.companyId) {
      throw new ForbiddenException({
        code: ErrorCode.NO_COMPANY,
        message: ErrorMessage[ErrorCode.NO_COMPANY],
      });
    }

    const company = await this.companyRepo.findOne({ where: { id: user.companyId } });
    if (!company) {
      throw new NotFoundException({
        code: ErrorCode.COMPANY_NOT_FOUND,
        message: ErrorMessage[ErrorCode.COMPANY_NOT_FOUND],
      });
    }
    return company;
  }

  async listMembers(user: AuthenticatedUser) {
    this.assertOwner(user);
    return this.memberRepo
      .find({
        where: { company: { id: user.companyId } },
        relations: { user: true },
        order: { joinedAt: 'ASC' },
      })
      .then((members) =>
        members.map((m) => ({
          id: m.id,
          userId: m.user.id,
          email: m.user.email,
          role: m.role,
          joinedAt: m.joinedAt,
        })),
      );
  }

  async addMember(user: AuthenticatedUser, dto: AddMemberDto) {
    this.assertOwner(user);

    if (dto.role === CompanyRole.OWNER) {
      throw new BadRequestException({
        code: ErrorCode.INVALID_MEMBER_ROLE,
        message: ErrorMessage[ErrorCode.INVALID_MEMBER_ROLE],
      });
    }

    let employee = await this.usersService.findByEmail(dto.email);
    if (!employee) {
      const hashed = await bcrypt.hash(dto.password, 10);
      employee = await this.usersService.create(dto.email, hashed);
    } else {
      const existingMembership = await this.findMembershipByUserId(employee.id);
      if (existingMembership) {
        throw new ConflictException({
          code: ErrorCode.ALREADY_IN_COMPANY,
          message: ErrorMessage[ErrorCode.ALREADY_IN_COMPANY],
        });
      }
    }

    const member = await this.memberRepo.save(
      this.memberRepo.create({
        user: employee,
        company: { id: user.companyId },
        role: dto.role ?? CompanyRole.VIEWER,
      }),
    );

    return {
      id: member.id,
      userId: employee.id,
      email: employee.email,
      role: member.role,
      joinedAt: member.joinedAt,
    };
  }

  async updateMemberRole(user: AuthenticatedUser, memberUserId: string, dto: UpdateMemberRoleDto) {
    this.assertOwner(user);

    if (memberUserId === user.id) {
      throw new BadRequestException({
        code: ErrorCode.CANNOT_CHANGE_OWN_ROLE,
        message: ErrorMessage[ErrorCode.CANNOT_CHANGE_OWN_ROLE],
      });
    }

    const member = await this.memberRepo.findOne({
      where: { user: { id: memberUserId }, company: { id: user.companyId } },
      relations: { user: true },
    });
    if (!member) {
      throw new NotFoundException({
        code: ErrorCode.MEMBER_NOT_FOUND,
        message: ErrorMessage[ErrorCode.MEMBER_NOT_FOUND],
      });
    }
    if (member.role === CompanyRole.OWNER) {
      throw new ForbiddenException({
        code: ErrorCode.CANNOT_MODIFY_OWNER,
        message: ErrorMessage[ErrorCode.CANNOT_MODIFY_OWNER],
      });
    }

    member.role = dto.role;
    await this.memberRepo.save(member);

    return {
      id: member.id,
      userId: member.user.id,
      email: member.user.email,
      role: member.role,
      joinedAt: member.joinedAt,
    };
  }

  async removeMember(user: AuthenticatedUser, memberUserId: string) {
    this.assertOwner(user);

    if (memberUserId === user.id) {
      throw new BadRequestException({
        code: ErrorCode.CANNOT_REMOVE_SELF,
        message: ErrorMessage[ErrorCode.CANNOT_REMOVE_SELF],
      });
    }

    const member = await this.memberRepo.findOne({
      where: { user: { id: memberUserId }, company: { id: user.companyId } },
    });
    if (!member) {
      throw new NotFoundException({
        code: ErrorCode.MEMBER_NOT_FOUND,
        message: ErrorMessage[ErrorCode.MEMBER_NOT_FOUND],
      });
    }
    if (member.role === CompanyRole.OWNER) {
      throw new ForbiddenException({
        code: ErrorCode.CANNOT_MODIFY_OWNER,
        message: ErrorMessage[ErrorCode.CANNOT_MODIFY_OWNER],
      });
    }

    await this.memberRepo.remove(member);
    return { message: 'Member removed successfully' };
  }

  private assertOwner(user: AuthenticatedUser) {
    if (!user.companyId || user.role !== CompanyRole.OWNER) {
      throw new ForbiddenException({
        code: ErrorCode.OWNER_ONLY,
        message: ErrorMessage[ErrorCode.OWNER_ONLY],
      });
    }
  }
}
