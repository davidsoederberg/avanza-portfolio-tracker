FROM node:12-alpine

WORKDIR /usr/src/avanza-portfolio-tracker

COPY package*.json ./

RUN npm install

COPY . .

# Wait for mongodb to be ready
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && node index.js