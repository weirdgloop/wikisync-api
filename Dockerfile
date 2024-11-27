FROM node:18-alpine

WORKDIR /home/node/app/

ADD package.json yarn.lock ./

RUN yarn install