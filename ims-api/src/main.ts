import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { validationExceptionFactory } from './common/utils/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS (PRODUCTION SAFE)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'https://invetory-managment-system-txzl.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ✅ Global filters
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ✅ Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // ✅ Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription(
      'A scalable REST API for managing products, stock levels, suppliers, and inventory movements in real time.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // ✅ Render port fix
  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Server running on port ${port}`);
  console.log(`Swagger docs: /api`);
}

bootstrap();