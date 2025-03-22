import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from 'src/decorators/logger.decorator';
import { Feature } from 'src/models/feature.model';
import { GetFeaturesByApplicationRequest } from 'src/types/pompeii';
import { JSONLogger } from 'src/utils/logger';
import { ApplicationsService } from '../applications/applications.service';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectModel(Feature) private readonly feature: typeof Feature,
    private readonly applicationsService: ApplicationsService,
  ) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(FeaturesService.name)
  private readonly logger!: JSONLogger;

  /**
   * Retrieves a list of features associated with a specific application
   * identified by its slug.
   *
   * @param request - An object containing the slug of the application for which
   *                  features are being requested.
   * @returns A promise that resolves to an array of features. If the application
   *          does not exist, an empty array is returned.
   *
   * @throws Logs an error if the application with the specified slug does not exist.
   */
  async getFeaturesByApplication(
    request: GetFeaturesByApplicationRequest,
  ): Promise<Feature[]> {
    const application = await this.applicationsService.getBySlug(request.slug);

    if (!application) {
      this.logger.error(
        `Requesting features for non-existing application. Slug: ${request.slug}`,
      );
      return [];
    }

    return this.feature.findAll({
      where: { application_id: application.id },
    });
  }
}
