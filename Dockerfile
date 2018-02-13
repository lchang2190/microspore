FROM node:carbon

WORKDIR /usr/src/orderService

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npm", "start" ]