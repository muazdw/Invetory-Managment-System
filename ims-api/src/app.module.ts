import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ProductsModule } from './products/products.module';
import { InventoryModule } from './inventory/inventory.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { StockMovementsModule } from './stock-movements/stock-movements.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    CommonModule,

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isProd = config.get('NODE_ENV') === 'production';

        return {
          type: 'postgres',
          host: config.get('DATABASE_HOST'),
          port: parseInt(config.get('DATABASE_PORT', '5432'), 10),
          username: config.get('DATABASE_USER'),
          password: config.get('DATABASE_PASS'),
          database: config.get('DATABASE_NAME'),

          autoLoadEntities: true,

          // 🔥 IMPORTANT: kurrë true në prod
          synchronize: false,

          // 🔥 FIX SSL ERROR
          ssl: isProd
            ? { rejectUnauthorized: false }
            : false,
        };
      },
    }),

    ProductsModule,
    InventoryModule,
    SuppliersModule,
    StockMovementsModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
  ],
})
export class AppModule {}