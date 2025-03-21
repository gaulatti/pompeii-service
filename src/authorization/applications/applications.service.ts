import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Logger } from 'src/decorators/logger.decorator';
import { Application } from 'src/models/application.model';
import { JSONLogger } from 'src/utils/logger';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application) private readonly application: typeof Application,
  ) {}

  /**
   * Logger instance for logging messages.
   */
  @Logger(ApplicationsService.name)
  private readonly logger!: JSONLogger;

  async getBySlug(slug: string) {
    return this.application.findOne({ where: { slug } });
  }
}
