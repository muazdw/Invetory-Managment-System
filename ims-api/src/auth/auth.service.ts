import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ErrorCode } from '../common/constants/error-codes.constants';
import { ErrorMessage } from '../common/constants/error-messages.constants';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { CompaniesService } from '../companies/companies.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { CompanyRole } from '../common/enums/company-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private companiesService: CompaniesService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException({
        code: ErrorCode.EMAIL_ALREADY_EXISTS,
        message: ErrorMessage[ErrorCode.EMAIL_ALREADY_EXISTS],
      });
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto.email, hashed);
    const company = await this.companiesService.create(user.id, {
      name: dto.companyName,
      address: dto.address,
    });

    return {
      id: user.id,
      email: user.email,
      company: {
        id: company.id,
        name: company.name,
        address: company.address ?? undefined,
      },
      role: CompanyRole.OWNER,
      access_token: await this.issueToken(user.id),
      createdAt: user.createdAt,
    };
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException({
        code: ErrorCode.INVALID_CREDENTIALS,
        message: 'Invalid email or password',
      });
    }
    return { access_token: await this.issueToken(user.id) };
  }

  async issueToken(userId: string): Promise<string> {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException({
        code: ErrorCode.INVALID_CREDENTIALS,
        message: 'User not found',
      });
    }

    const membership = await this.companiesService.findMembershipByUserId(userId);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      ...(membership && {
        companyId: membership.company.id,
        role: membership.role,
      }),
    };
    return this.jwtService.sign(payload);
  }
}
