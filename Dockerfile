FROM node:12-alpine

WORKDIR /usr/app

COPY ./package.json .
COPY ./yarn.lock .

ENV NODE_ENV production
ENV REDIS_HOST localhost
ENV REDIS_PORT 6379
ENV REDIS_USE_TLS false
ENV REDIS_DATABASE false
ENV REDIS_PASSWORD ''
ENV BULL_PREFIX bull
ENV BASIC_AUTH false
ENV BASIC_AUTH_USER 'admin'
ENV BASIC_AUTH_PASSWORD 'admin'

RUN yarn install

COPY . .

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

CMD ["node", "index.js"]
