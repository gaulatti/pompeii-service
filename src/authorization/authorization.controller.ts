import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from 'src/authentication/users/users.service';
import {
  GetFeaturesByApplicationRequest,
  GetFeaturesByApplicationResponse,
  LoginRequest,
  LoginResponse,
  User,
} from '../types/pompeii';
import { FeaturesService } from './features/features.service';

/**
 * Controller responsible for handling authorization-related operations.
 */
@Controller('authorization')
export class AuthorizationController {
  /**
   * Initializes a new instance of the `AuthorizationController` class.
   *
   * @param authorizationService - The service used to handle authorization logic.
   * @param featuresService - The service used to manage features.
   */
  constructor(
    private readonly featuresService: FeaturesService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Handles the gRPC method `GetFeaturesByApplication` for the `PompeiiService`.
   *
   * This method retrieves the features associated with a specific application.
   *
   * @param data - The request data containing the application details.
   * @returns A promise that resolves to the response containing the features of the application.
   */
  @GrpcMethod('PompeiiService', 'GetFeaturesByApplication')
  async getFeaturesByApplication(
    data: GetFeaturesByApplicationRequest,
  ): Promise<GetFeaturesByApplicationResponse> {
    const features = await this.featuresService.getFeaturesByApplication(data);

    return { features };
  }

  /**
   * Handles the login process by updating the user information and retrieving
   * the features associated with the specified application key.
   *
   * @param data - The login request data containing user credentials and application key.
   * @returns A promise that resolves to a `LoginResponse` object containing the updated user information
   *          and the features available for the specified application.
   */
  @GrpcMethod('PompeiiService', 'Login')
  async login(data: LoginRequest): Promise<LoginResponse> {
    const me = await this.usersService.updateUser(data);
    const features = await this.featuresService.getFeaturesByApplication({
      slug: data.key,
    });

    const kickoff: LoginResponse = {
      me: me as unknown as User,
      features,
    };

    return kickoff;
  }
}
