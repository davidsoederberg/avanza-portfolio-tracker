FROM node:12-alpine

WORKDIR /usr/src/avanza-portfolio-tracker/worker

COPY package*.json ./

RUN npm install

COPY . .

# Sleep to let mongodb to boot up
CMD sleep 5 && node index.js
