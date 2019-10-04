FROM node:10-alpine

WORKDIR /usr/src/app

COPY ./ubp-lab4-practicos/grisafi/package*.json .

RUN npm install

COPY ./ubp-lab4-practicos/grisafi/. .

CMD node index.js

EXPOSE 8081