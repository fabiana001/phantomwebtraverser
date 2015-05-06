FROM redis

MAINTAINER Fabio Fumarola <fabiofumarola@gmail.com>

# Define mountable directories.
VOLUME ["/data"]

# Define working directory.
WORKDIR /data

COPY redis.conf /etc/redis/redis.conf

# Define default command.
CMD ["redis-server", "/etc/redis/redis.conf"]

# Expose ports.
EXPOSE 6379
