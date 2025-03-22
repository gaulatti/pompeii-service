import { Logger } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import { AppModule } from './app.module';
import { AuthenticationGuard } from './authentication/authentication.guard';
import { grpcPort, httpPort } from './utils/network';

/**
 * Initializes and starts the NestJS application with Fastify adapter.
 *
 * - Creates a new Nest application using the Fastify adapter.
 * - Enables CORS for the application.
 * - Registers the global authentication guard.
 * - Starts the application and listens for REST API.
 *
 * @returns {Promise<void>} A promise that resolves when the application has started.
 */
async function bootstrap(): Promise<void> {
  /**
   * Create a new Nest application using the Fastify adapter
   */
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  /**
   * Enable CORS for the application
   */
  app.enableCors();

  /**
   * Register the global authenticatiojn guard
   */
  app.useGlobalGuards(new AuthenticationGuard(app.get(Reflector)));

  /**
   * Start the gRPC server
   */
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'pompeii',
      protoPath: join(__dirname, './proto/pompeii.proto'),
      url: `0.0.0.0:${grpcPort}`,
      loader: {
        keepCase: true,
      },
    },
  });
  await app.startAllMicroservices();
  Logger.log(`🚀 gRPC server running on port ${grpcPort}`);

  /**
   * Start the application.
   */
  await app.listen(httpPort, '0.0.0.0');
  Logger.log(`🚀 REST API running on port ${httpPort}`);
}

bootstrap();
