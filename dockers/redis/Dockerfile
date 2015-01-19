FROM redis

MAINTAINER Fabio Fumarola <fabiofumarola@gmail.com>

VOLUME /data

WORKDIR /data

EXPOSE 6379

COPY redis.conf /usr/local/etc/redis/redis.conf
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]