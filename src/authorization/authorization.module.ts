import { Module } from '@nestjs/common';
import { DalModule } from 'src/dal/dal.module';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './authorization.service';
import { PermissionsService } from './permissions/permissions.service';
import { FeaturesService } from './features/features.service';
import { ApplicationsService } from './applications/applications.service';

@Module({
  controllers: [AuthorizationController],
  providers: [AuthorizationService, PermissionsService, FeaturesService, ApplicationsService],
  imports: [DalModule],
})
export class AuthorizationModule {}
