FROM node:16-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn --production

COPY . .

CMD [ "npm", "start" ]