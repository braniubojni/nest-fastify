import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    SequelizeModule.forRootAsync({
      useFactory: async () => {
        const {
          DB_HOST: host,
          DB_PORT: port,
          DB_USER: username,
          DB_PASS: password,
          DB_NAME: database,
        } = process.env;
        return {
          dialect: 'postgres',
          host,
          port: +port,
          username,
          password,
          database,
          models: [User, Role, UserRoles],
          autoLoadModels: true,
        };
      },
    }),
    UsersModule,
    RolesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
