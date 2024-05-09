import { Injectable } from '@nestjs/common';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from '@azure/storage-blob';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AzureBlobService {
  private readonly blobServiceClient: BlobServiceClient;
  private readonly sharedKeyCredential: StorageSharedKeyCredential;

  constructor() {
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      accountName,
      accountKey,
    );
    this.blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      this.sharedKeyCredential,
    );
  }

  async generateSasToken(
    containerName: string,
    blobName: string,
  ): Promise<string> {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);
    const permissions = BlobSASPermissions.parse('racwd');
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 60); // Token válido por 1 hora
    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName,
        permissions,
        startsOn: startDate,
        expiresOn: expiryDate,
      },
      this.sharedKeyCredential, // Passando a instância sharedKeyCredential como segundo argumento
    );
    return `${blobClient.url}?${sasToken.toString()}`;
  }
}
