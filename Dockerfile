FROM node:lts-buster-slim

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

COPY . .

RUN npm ci

ENV NODE_ENV production

RUN npm run build

CMD ["npm", "start"]