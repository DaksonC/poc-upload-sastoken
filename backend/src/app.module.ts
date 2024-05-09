import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureBlobModule } from './azure-blob/azure-blob.module';

@Module({
  imports: [AzureBlobModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
