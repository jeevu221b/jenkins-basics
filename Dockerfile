FROM node:21-alpine
WORKDIR /app
COPY . .
RUN npm ci
ENTRYPOINT [ "npm", "start"]
EXPOSE 3000
