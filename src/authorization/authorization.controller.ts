import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FeaturesService } from './features/features.service';

export type GetFeaturesByApplicationRequest = {
  slug: string;
};

export type GetFeaturesByApplicationResponse = {
  features: { name: string; slug: string; default_value: string }[];
};

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
  constructor(private readonly featuresService: FeaturesService) {}

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
}
