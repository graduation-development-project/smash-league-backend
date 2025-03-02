FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY .env /usr/src/app/.env
COPY . .

EXPOSE 5000
