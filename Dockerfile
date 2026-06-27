FROM node:22-alpine AS builder

WORKDIR /api-saas 

COPY ./ ./

RUN yarn && yarn build

FROM node:22-alpine

WORKDIR /api-saas 

COPY --from=builder /api-saas/dist ./dist
COPY ./package.json ./
COPY ./yarn.lock ./

RUN yarn --production=true

CMD ["node", "./dist/server.js"]