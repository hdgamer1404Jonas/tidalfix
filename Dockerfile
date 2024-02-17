FROM node:latest

RUN mkdir -p /usr/src/tdfix
WORKDIR /usr/src/tdfix

COPY package.json /usr/src/tdfix
RUN apt-get update
RUN apt-get install -y build-essential
RUN npm install --build-from-source

RUN npm install -g typescript

COPY . /usr/src/tdfix

RUN tsc

CMD ["node", "build/index.js"]