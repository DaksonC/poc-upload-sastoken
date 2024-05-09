import { Controller, Get, Query, NotFoundException } from '@nestjs/common';
import { AzureBlobService } from './azure-blob.service';

@Controller('blob')
export class AzureBlobController {
  constructor(private readonly azureBlobService: AzureBlobService) {}

  @Get('sasToken')
  async generateSasToken(
    @Query('containerName') containerName: string,
    @Query('blobName') blobName: string,
  ): Promise<string> {
    const sasToken = await this.azureBlobService.generateSasToken(
      containerName,
      blobName,
    );
    if (!sasToken) {
      throw new NotFoundException('SAS Token não encontrado');
    }
    return sasToken;
  }
}
