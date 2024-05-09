// src/azure-blob/azure-blob.module.ts
import { Module } from '@nestjs/common';
import { AzureBlobService } from './azure-blob.service';
import { AzureBlobController } from './azure-blob.controller';

@Module({
  providers: [AzureBlobService],
  controllers: [AzureBlobController],
})
export class AzureBlobModule {}
