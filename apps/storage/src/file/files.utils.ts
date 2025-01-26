import {
  COMPRESSED_BUCKET_NAME,
  COMPRESSED_PRIVATE_BUCKET_NAME,
  DOCUMENT_BUCKET_NAME,
  DOCUMENT_PRIVATE_BUCKET_NAME,
  IMAGE_BUCKET_NAME,
  IMAGE_CACHE_BUCKET_NAME,
  IMAGE_PRIVATE_BUCKET_NAME,
  IMAGE_PRIVATE_CACHE_BUCKET_NAME,
  MEDIA_BUCKET_NAME,
  MEDIA_PRIVATE_BUCKET_NAME,
  SUPPORTED_COMPRESSED_FILES,
  SUPPORTED_DOCUMENTS,
  SUPPORTED_IMAGE,
  SUPPORTED_IMAGE_TO_RESIZE,
  SUPPORTED_MEDIA_FILES,
} from '@app/common';
import { Logger, NotFoundException } from '@nestjs/common';
import Jimp from 'jimp';
import { MinioClient } from 'nestjs-minio-client';
import { Stream } from 'stream';

export const cacheNamePattern = (
  imageName: string,
  width: number,
  quality: number,
) => {
  return (
    (width ? 'w_' + width + '_' : '') +
    (quality ? 'q_' + quality + '_' : '') +
    imageName
  );
};

export const getObjectName = (originalname: string): string => {
  return `${Date.now()}-${originalname}`;
};

export const getBucketNamePublic = (mimetype: any): string => {
  const bucket_name = SUPPORTED_IMAGE.includes(mimetype)
    ? IMAGE_BUCKET_NAME
    : SUPPORTED_DOCUMENTS.includes(mimetype)
      ? DOCUMENT_BUCKET_NAME
      : SUPPORTED_MEDIA_FILES.includes(mimetype)
        ? MEDIA_BUCKET_NAME
        : SUPPORTED_COMPRESSED_FILES.includes(mimetype)
          ? COMPRESSED_BUCKET_NAME
          : undefined;

  return bucket_name;
};

export const getBucketNamePrivate = (mimetype: any): string => {
  const bucket_name = SUPPORTED_IMAGE.includes(mimetype)
    ? IMAGE_PRIVATE_BUCKET_NAME
    : SUPPORTED_DOCUMENTS.includes(mimetype)
      ? DOCUMENT_PRIVATE_BUCKET_NAME
      : SUPPORTED_MEDIA_FILES.includes(mimetype)
        ? MEDIA_PRIVATE_BUCKET_NAME
        : SUPPORTED_COMPRESSED_FILES.includes(mimetype)
          ? COMPRESSED_PRIVATE_BUCKET_NAME
          : undefined;

  return bucket_name;
};

export const getBucketNameCache = (): string => {
  return IMAGE_CACHE_BUCKET_NAME;
};

export const getBucketNamePrivateCache = (): string => {
  return IMAGE_PRIVATE_CACHE_BUCKET_NAME;
};

export const checkIfCapableToBeCached = (mimetype: any): boolean => {
  return SUPPORTED_IMAGE_TO_RESIZE.includes(mimetype);
};

export const downloadFileProcess = async (
  client: MinioClient,
  logger: Logger,
  bucketCacheName: string,
  bucket_name: string,
  object_name: string,
  width: number,
  quality: number,
) => {
  try {
    const resizedObjectName = cacheNamePattern(object_name, width, quality);

    // Step 1: Check if the resized image already exists in MinIO
    try {
      await client.statObject(bucketCacheName, resizedObjectName);

      // If the resized image exists, retrieve and return it
      const resizedObjectStream = await client.getObject(
        bucketCacheName,
        resizedObjectName,
      );
      return resizedObjectStream;
    } catch (error) {
      // If the resized image does not exist, proceed to step 2
      logger.log('Resized image not found, creating a new one...');
    }

    // Step 2: Retrieve the original image from MinIO
    const originalObjectStream: Stream = await client.getObject(
      bucket_name,
      object_name,
    );

    // Convert stream to buffer for processing
    const originalBuffer = await streamToBuffer(originalObjectStream);

    // Step 3: Use Jimp to resize the image
    const image = await Jimp.read(originalBuffer);
    if (width) await image.resize(width, Jimp.AUTO); // Resizing by width, maintaining aspect ratio
    if (quality) await image.quality(quality); // Set the image quality

    // Step 4: Get the processed image as a buffer
    const resizedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    // Step 5: Save the resized image back to MinIO
    await client.putObject(
      bucketCacheName,
      resizedObjectName,
      resizedImageBuffer,
      resizedImageBuffer.length,
      // {
      //   'Content-Type': 'image/jpeg', // Adjust if necessary
      // },
    );

    // Step 6: Return the resized image stream (or the buffer)
    return bufferToStream(resizedImageBuffer);
  } catch (error) {
    logger.error(`Error downloading file from MinIO: ${error.message}`);
    throw new NotFoundException('File not found');
  }
};

// Helper function to convert a stream to a buffer
export const streamToBuffer = async (stream: Stream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
};

// Helper function to convert a buffer back to a stream
export const bufferToStream = (buffer: Buffer): Stream => {
  const stream = new Stream.PassThrough();
  stream.end(buffer);
  return stream;
};
