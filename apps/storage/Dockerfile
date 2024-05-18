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
RUN mkdir -p /usr/src/values/cache_images

ENV IMAGE_PATH=/usr/src/values/images
ENV CACHE_IMAGE_PATH=/usr/src/values/cache_images

CMD [ "node", "dist/apps/storage/main" ]
