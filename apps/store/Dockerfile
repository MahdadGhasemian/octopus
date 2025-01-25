# ============== Stage 1 ================
FROM node:alpine As development

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY apps/store apps/store

RUN pnpm install -r

# ============== Stage 2 ================
FROM base As builder

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/store apps/store
COPY libs libs

RUN pnpm run build store

# ============== Stage 3 ================
FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE=${NODE_ENV}

COPY --from=development /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./dist/apps/store/node_modules

CMD [ "node", "dist/apps/store/main" ]
