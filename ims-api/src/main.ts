import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { validationExceptionFactory } from './common/utils/validation-exception.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ FIXED CORS FOR VERCEL + LOCAL + RENDER
  app.enableCors({
    origin: [
      'https://invetory-managment-system-txzl.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ✅ Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // ✅ Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: validationExceptionFactory,
    }),
  );

  // ✅ Swagger
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

  // ✅ Render PORT FIX
  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`Server running on port ${port}`);
  console.log(`Swagger docs: /api`);
}

bootstrap();