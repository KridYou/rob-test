import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { CardModule } from './card/card.module';
import { Card, Comment } from './card/entities/card.entity';
import { CardHistory } from './card/entities/card-histories.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'nestuser',
      password: process.env.DB_PASSWORD || 'nestpass',
      database: process.env.DB_NAME || 'rob-db',
      entities: [User, Card, Comment, CardHistory],
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    })
    ,
    AuthModule,
    UserModule,
    CardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
