FROM node:21-alpine
WORKDIR /app
COPY . .
RUN npm install --production
ENTRYPOINT [ "npm", "start"]
EXPOSE 3000
