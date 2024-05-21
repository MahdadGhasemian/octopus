# ============== Stage 1 ================
FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY apps/storage apps/storage
COPY libs libs

RUN npm install -r

RUN npm run build storage

# ============== Stage 2 ================
FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --prod

COPY --from=development /usr/src/app/dist ./dist

RUN mkdir -p /usr/src/values/images
RUN mkdir -p /usr/src/values/documents
RUN mkdir -p /usr/src/values/media
RUN mkdir -p /usr/src/values/compressed
RUN mkdir -p /usr/src/values/cache_images
RUN mkdir -p /usr/src/values/images_private
RUN mkdir -p /usr/src/values/documents_private
RUN mkdir -p /usr/src/values/media_private
RUN mkdir -p /usr/src/values/compressed_private
RUN mkdir -p /usr/src/values/cache_images_private


ENV IMAGE_PATH=/usr/src/values/images
ENV DOCUMENT_PATH=/usr/src/values/documents
ENV MEDIA_PATH=/usr/src/values/media
ENV COMPRESSED_PATH=/usr/src/values/compressed
ENV CACHE_IMAGE_PATH=/usr/src/values/cache_images
ENV IMAGE_PRIVATE_PATH=/usr/src/values/images_private
ENV DOCUMENT_PRIVATE_PATH=/usr/src/values/documents_private
ENV MEDIA_PRIVATE_PATH=/usr/src/values/media_private
ENV COMPRESSED_PRIVATE_PATH=/usr/src/values/compressed_private
ENV CACHE_IMAGE_PRIVATE_PATH=/usr/src/values/cache_images_private


CMD [ "node", "dist/apps/storage/main" ]
