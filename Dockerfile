
ARG NODE_VERSION=20.12.2

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

FROM base as deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps as build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

FROM base as final
ENV NODE_ENV production
USER node
WORKDIR /usr/src/app
USER root
RUN mkdir -p /usr/src/app/logs/prod && \
    chown -R node:node /usr/src/app/logs
USER node
COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY .env.production .env.production


ENV PORT=3000
ENV MONGODB_URI=mongodb://localhost:27017/mydatabase
CMD npm start
