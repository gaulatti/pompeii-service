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
   * Retrieves a list of features associated with a specific application.
   *
   * @param request - An object containing the slug of the application for which features are being requested.
   * @returns A promise that resolves to an array of objects, each representing a feature with its name, slug, and default value.
   *          If the application does not exist, an empty array is returned.
   *
   * @remarks
   * - Logs an error if the requested application does not exist.
   * - The `default_value` of a feature defaults to 'C' if it is not explicitly set.
   */
  async getFeaturesByApplication(
    request: GetFeaturesByApplicationRequest,
  ): Promise<{ name: string; slug: string; default_value: string }[]> {
    const application = await this.applicationsService.getBySlug(request.slug);

    if (!application) {
      this.logger.error(
        `Requesting features for non-existing application. Slug: ${request.slug}`,
      );
      return [];
    }

    const features = await this.feature.findAll({
      where: { application_id: application.id },
      attributes: ['name', 'slug', 'default_value'],
    });

    return features.map((feature) => ({
      name: feature.name,
      slug: feature.slug,
      default_value: feature.default_value,
    }));
  }
}
