export const IMAGE_BUCKET_NAME = 'public-images';
export const DOCUMENT_BUCKET_NAME = 'public-documents';
export const MEDIA_BUCKET_NAME = 'public-media';
export const COMPRESSED_BUCKET_NAME = 'public-compressed';

export const IMAGE_PRIVATE_BUCKET_NAME = 'private-images';
export const DOCUMENT_PRIVATE_BUCKET_NAME = 'private-documents';
export const MEDIA_PRIVATE_BUCKET_NAME = 'private-media';
export const COMPRESSED_PRIVATE_BUCKET_NAME = 'private-compressed';

export const IMAGE_CACHE_BUCKET_NAME = 'cache-images';
export const IMAGE_PRIVATE_CACHE_BUCKET_NAME = 'private-cache-images';

export const SUPPORTED_IMAGE_TO_RESIZE = [
  'image/jpeg', // jpg, jpeg
  'image/png', // png
  'image/bmp', // bmp
  'image/tiff', // tiff
  'image/gif', // gif
];
export const SUPPORTED_IMAGE = [
  'image/jpeg', // jpg, jpeg
  'image/png', // png
  'image/bmp', // bmp
  'image/tiff', // tiff
  'image/gif', // gif
  'image/webp', // webp
];
export const SUPPORTED_DOCUMENTS = [
  'application/msword', // doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.ms-excel', // xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/pdf', // pdf
  'text/plain', // txt
  'application/rtf', // rtf
];

export const SUPPORTED_MEDIA_FILES = [
  'audio/mpeg', // mp3
  'audio/wav', // wav
  'video/mp4', // mp4
  'video/x-msvideo', // avi
  'video/x-matroska', // mkv
];
export const SUPPORTED_COMPRESSED_FILES = [
  'application/x-zip-compressed', // zip
  'application/zip', // zip
  'application/x-rar-compressed', // rar
  'application/x-tar', // tar
  'application/x-7z-compressed', // 7z
  'application/gzip', // gz
];

export const MIME_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  gif: 'image/gif',
  webp: 'image/webp',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  pdf: 'application/pdf',
  txt: 'text/plain',
  rtf: 'application/rtf',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  mp4: 'video/mp4',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  zip: 'application/zip',
  rar: 'application/x-rar-compressed',
  tar: 'application/x-tar',
  '7z': 'application/x-7z-compressed',
  gz: 'application/gzip',
};

export const SUPPORTED_INVOICE_DOCUMENTS = [
  'application/pdf', // pdf
];
