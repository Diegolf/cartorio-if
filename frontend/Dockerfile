FROM node:10

WORKDIR /usr/src/app

ENV NODE_PATH=./src

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "npm", "start" ]