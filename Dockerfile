# Use official Node.js image as base
FROM node:20-slim

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 6620

CMD ["npm", "run", "dev"]
