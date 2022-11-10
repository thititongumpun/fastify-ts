FROM node:16-bullseye

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn prisma generate

CMD [ "npm", "start" ]