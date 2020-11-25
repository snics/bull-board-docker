Docker image for [bull-board]. Allow you to monitor your bull queue without any coding!

Supports both: bull and bullmq. bull-board version 1.0.0-alpha.4

### Quick start with Docker
```
docker run -p 3000:3000 deadly0/bull-board
```
will run bull-board interface on `localhost:3000` and connect to your redis instance on `localhost:6379` without password.

To configurate redis see "Environment variables" section.

### Quick start with docker-compose
```
version: '3.5'

services:
  bullboard:
    container_name: bullboard
    image: deadly0/bull-board
    restart: always
    ports:
      - 3000:3000
```
will run bull-board interface on `localhost:3000` and connect to your redis instance on `localhost:6379` without password.

see "Example with docker-compose" section for example with env parameters


### Environment variables
* `REDIS_HOST` - host to connect to redis (localhost by default)
* `REDIS_PORT` - redis port (6379 by default)
* `REDIS_USE_TLS` - enable TLS true or false (false by default)
* `REDIS_PASSWORD` - password to connect to redis (no password by default)
* `REDIS_DATABASE` - database to connect to redis (no database by default)
* `BULL_PREFIX` - prefix to your bull queue name (bull by default)
* `BASE_PATH` - basePath for bull board, e.g. '/bull-board' ('/' by default)

### Example with docker-compose
```
version: '3.5'

services:
  redis:
    container_name: redis
    image: redis:5.0-alpine
    restart: always
    ports:
      - 6379:6379
    volumes:
      - redis_db_data:/data

  bullboard:
    container_name: bullboard
    image: deadly0/bull-board
    restart: always
    ports:
      - 3000:3000
    environment:
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: example-password
      REDIS_USE_TLS: false
      BULL_PREFIX: bull
    depends_on:
      - redis

volumes:
  redis_db_data:
    external: false
```

[bull-board]: https://github.com/vcapretz/bull-board
