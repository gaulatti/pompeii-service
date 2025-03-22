import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from 'src/authentication/users/users.service';
import {
  GetFeaturesByApplicationRequest,
  GetFeaturesByApplicationResponse,
  User,
  UserContext,
  UserIdentity,
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
   * @returns A promise that resolves to a `UserContext` object containing the updated user information
   *          and the features available for the specified application.
   */
  @GrpcMethod('PompeiiService', 'Login')
  async login(data: UserIdentity): Promise<UserContext> {
    /**
     * Get the Features for the current app.
     */
    const defaultFeatures = await this.featuresService.getFeaturesByApplication(
      {
        slug: data.key,
      },
    );

    /**
     * Get the current user, and if required, create or update it.
     */
    const me = await this.usersService.updateUser(data);

    /**
     * TODO: Update this to have different permission sets per team, even if it's the same user.
     */
    const userPermissions =
      me.memberships?.flatMap((item) => item.permissions) || [];

    /**
     * Override default permissions with membership-level treatments where applicable.
     */
    const features = defaultFeatures.map((item) => {
      const override = userPermissions.find(
        (permission) => permission?.feature_id === item.id,
      )?.level;

      if (override) {
        item.default_value = override;
      }

      return item;
    });

    const kickoff: UserContext = {
      me: me as unknown as User,
      features,
    };

    return kickoff;
  }
}
