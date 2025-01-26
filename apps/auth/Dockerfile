# ============== Stage 1 ================
FROM node:alpine As base

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY apps/auth apps/auth

RUN pnpm install -r

# ============== Stage 2 ================
FROM base As builder

COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json
COPY apps/auth apps/auth
COPY libs libs

RUN pnpm run build auth

# ============== Stage 3 ================
FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE=${NODE_ENV}

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./dist/apps/auth/node_modules

CMD [ "node", "dist/apps/auth/main" ]
