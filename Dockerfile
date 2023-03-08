# Use an official Node.js runtime as a parent image
FROM node:lts-alpine
ENV MONGODB_URL mongodb+srv://Swetha:mongodb@cluster0.waoy39q.mongodb.net/?retryWrites=true&w=majority
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
CMD [ "npm", "start"]