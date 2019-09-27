FROM node:10

WORKDIR /usr/src/app

COPY . .

RUN npm install

# Bundle app source
EXPOSE 8080

# CMD [ "node", "app.js" ]

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait && node app.js