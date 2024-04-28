# ============== Stage 1 ================
FROM node:alpine As development

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

COPY apps/auth apps/auth
COPY libs libs

RUN npm install -r

RUN npm run build auth

# ============== Stage 2 ================
FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --prod

COPY --from=development /usr/src/app/dist ./dist

CMD [ "node", "dist/apps/auth/main" ]
