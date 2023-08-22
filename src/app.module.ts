import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { Post } from './posts/posts.model';
import { PostsModule } from './posts/posts.module';
import { Role } from './roles/roles.model';
import { RolesModule } from './roles/roles.module';
import { UserRoles } from './roles/user-roles.model';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';
import { UtilsModule } from './utils/utils.module';

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
          models: [User, Role, UserRoles, Post],
          autoLoadModels: true,
        };
      },
    }),
    UsersModule,
    RolesModule,
    UtilsModule,
    AuthModule,
    PostsModule,
    FilesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
