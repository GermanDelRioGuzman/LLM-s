# syntax=docker/dockerfile:1
FROM node:14
WORKDIR /code
COPY package*.json ./
RUN npm install
EXPOSE 5000
COPY . .
CMD ["node", "index.js"]