#we are gonna use node.js runtime as the base image
FROM node:14

#set the working directory
WORKDIR /usr/src/app

#copy the package.json and package-lock.json
COPY package*.json ./

#gonna install the dependencies
RUN npm install

# copy the rest of the application code
COPY . .

#this is the port on my web runs

#this is the terminal command torun the web
CMD ["node","src/app/index.js"]
