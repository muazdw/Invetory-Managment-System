import { SetMetadata } from '@nestjs/common';
import { REQUIRE_COMPANY_KEY } from '../constants/metadata.constants';

export const RequireCompany = () => SetMetadata(REQUIRE_COMPANY_KEY, true);
