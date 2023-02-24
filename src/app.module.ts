import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CountriesModule } from './modules/countries/countries.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoUrl } from './configs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NewsModule } from './modules/news/news.module';
import { AttachmentsModule } from './modules/attachments/attachments.module';
import { BranchModule } from './modules/branch/branch.module';
import { ClassSubjectModule } from './modules/class-subject/class-subject.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { AwardsModule } from './modules/awards/awards.module';
import { CoursesModule } from './modules/courses/courses.module';
import { RoomsModule } from './modules/rooms/rooms.module';
import { UnionsModule } from './modules/unions/unions.module';

@Module({
  imports: [
    CountriesModule,
    MongooseModule.forRoot(mongoUrl),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'src/public'),
    }),
    AuthModule,
    UsersModule,
    NewsModule,
    AttachmentsModule,
    BranchModule,
    ClassSubjectModule,
    FacultiesModule,
    BlogsModule,
    AwardsModule,
    CoursesModule,
    RoomsModule,
    UnionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
