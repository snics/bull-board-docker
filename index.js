const { setQueues, router } = require('bull-board');
const Queue = require('bull');
const express = require('express');
const basicAuth = require('express-basic-auth');
const redis = require('redis');

const {
  REDIS_PORT = 6379,
  REDIS_HOST = 'localhost',
  REDIS_PASSWORD,
  REDIS_USE_TLS,
  REDIS_DATABASE,
  BULL_PREFIX = 'bull',
  PORT = 3000,
  BASE_PATH = '/',
  BASIC_AUTH = false,
  BASIC_AUTH_USER = 'admin',
  BASIC_AUTH_PASSWORD = 'admin'
} = process.env;

const redisConfig = {
  redis: {
    port: REDIS_PORT,
    host: REDIS_HOST,
    ...( REDIS_PASSWORD && { password: REDIS_PASSWORD } ),
    ...( REDIS_DATABASE && { db: REDIS_DATABASE } ),
    tls: REDIS_USE_TLS === 'true'
  }
};

const client = redis.createClient(redisConfig.redis);
const prefix = BULL_PREFIX;
const port = PORT;
const basePath = BASE_PATH;

client.KEYS(`${prefix}:*`, (err, keys) => {
  const uniqKeys = new Set(keys.map(key => key.replace(/^.+?:(.+?):.+?$/, '$1')));
  const queueList = Array.from(uniqKeys).map((item) => new Queue(item, redisConfig));

  setQueues(queueList);
});

const app = express();

if (BASIC_AUTH === 'true') {
  const users = {};
  if (BASIC_AUTH_USER && BASIC_AUTH_PASSWORD) {
    users[BASIC_AUTH_USER] = BASIC_AUTH_PASSWORD;
  }

  app.use(basicAuth({
    users,
    challenge: true,
  }));
}

app.use(`${basePath}`, router);
app.listen(port, () => {
  console.log(`bull-board listening on port ${port} on basePath "${basePath}"!`);
  if (BASIC_AUTH === 'true') console.log(`Basic auth is active!`);
});
