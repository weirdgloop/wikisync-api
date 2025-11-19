FROM node:22-alpine

WORKDIR /home/node/app/

ADD package.json yarn.lock ./

RUN yarn install