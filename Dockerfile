# syntax=docker/dockerfile:1
FROM node:14
WORKDIR /code
ENV FLASK_APP=app.py
ENV FLASK_RUN_HOST=0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY package*.json./
RUN npm install
EXPOSE 5000
COPY . .
CMD ["node", "index.js"]