import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AccessLog } from 'src/models/access.log.model';
import { Application } from 'src/models/application.model';
import { Feature } from 'src/models/feature.model';
import { Login } from 'src/models/login.model';
import { Membership } from 'src/models/membership.model';
import { Permission } from 'src/models/permission.model';
import { Team } from 'src/models/team.model';
import { User } from 'src/models/user.model';
import { BackupService } from './backup/backup.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      AccessLog,
      Application,
      Feature,
      Login,
      Membership,
      Permission,
      Team,
      User,
    ]),
  ],
  exports: [SequelizeModule],
  providers: [BackupService],
})
export class DalModule {}
