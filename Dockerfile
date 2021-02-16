FROM node:14.15

WORKDIR /usr/app/api
ADD ./api/package.json ./api/npm.lock ./
RUN yarn install

WORKDIR /usr/app
COPY ./api ./api

WORKDIR /usr/app/api
RUN yarn build

EXPOSE 4000
CMD ["node", "-r", "ts-node/register/transpile-only", "-r", "tsconfig-paths/register", "-r", "dotenv/config", "./build/app.js"]
