FROM node:12-alpine

WORKDIR /usr/src/avanza-portfolio-tracker

COPY package*.json ./

RUN npm install

COPY . .

CMD ["node", "index.js"]