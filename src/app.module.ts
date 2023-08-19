import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRoles } from './roles/user-roles.model';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { Post } from './posts/posts.model';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
