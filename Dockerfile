FROM node:16-alpine

WORKDIR /home/node/app/

ADD package.json package-lock.json yarn.lock ./

RUN yarn install