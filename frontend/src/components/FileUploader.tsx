import React, { useState, useCallback } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useDropzone, DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';

interface ExtendedFile extends File {
  preview?: string;
}

const FileUploader: React.FC = () => {
  const [uploading, setUploading] = useState<boolean>(false);

  const onDrop = useCallback(async (acceptedFiles: ExtendedFile[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const response: AxiosResponse<string> = await axios.get(
        'http://localhost:3001/blob/sasToken', {
          params: {
            containerName: process.env.REACT_APP_CONTAINER_NAME || 'seu_container', // especificar em qual contêiner esse arquivo será armazenado
            blobName: file.name
          }
      });

      const sasToken = response.data;
      const uploadUrl = `${file.preview}?${sasToken}`;

      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type
        }
      });
      alert('Upload concluído com sucesso!');
    } catch (error) {
      alert('Erro ao fazer upload do arquivo');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps }: { getRootProps: () => DropzoneRootProps, getInputProps: () => DropzoneInputProps } = useDropzone({ onDrop });

  return (
    <div 
      {...getRootProps()} 
      style={
        { 
          maxWidth: '320px',
          border: '2px dashed #5c4343', 
          padding: '48px', 
          borderRadius: '4px',
          margin: '16px auto',
          textAlign: 'center', 
          color: '#5a5656',
        }
      }
    >
      <input {...getInputProps()} />
      {
        uploading 
        ? <p>Uploading...</p> 
        : <p>Drag and drop a file here or click to select</p>
      }
    </div>
  );
};

export default FileUploader;

