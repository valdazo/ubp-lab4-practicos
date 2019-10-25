FROM node:10

# Create app directory
RUN mkdir -p /usr/src/app/db
WORKDIR /usr/src/app/db

# Install app dependencies
COPY package.json /usr/src/app/db/
RUN npm install

# Bundle app source
COPY . /usr/src/app/db

EXPOSE 7070