FROM node:10

# Create app directory
RUN mkdir -p /usr/src/app/api
WORKDIR /usr/src/app/api

# Install app dependencies
COPY package.json /usr/src/app/api/
RUN npm install

# Bundle app source
COPY . /usr/src/app/api

EXPOSE 5555