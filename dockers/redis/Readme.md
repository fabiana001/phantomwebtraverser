## Redis Dockerfile


This repository contains **Dockerfile** of [Redis](http://redis.io/) for [Docker](https://www.docker.com/)'s [automated build](https://registry.hub.docker.com/u/dockerfile/redis/) published to the public [Docker Hub Registry](https://registry.hub.docker.com/).


### Base Docker Image

* [dockerfile/ubuntu](http://dockerfile.github.io/#/ubuntu)


### Installation

1. Install [Docker](https://www.docker.com/).

2. Download [automated build](https://registry.hub.docker.com/u/dockerfile/redis/) from public [Docker Hub Registry](https://registry.hub.docker.com/): `docker pull dockerfile/redis`

   (alternatively, you can build an image from Dockerfile: `docker build -t="wheretolive/redis" ./`)


### Usage

#### Run `redis-server`

    docker run -d --name redis -p 6379:6379 wheretolive/redis

#### Run `redis-server` with persistent data directory. (creates `dump.rdb`)

    docker run -d -p 6379:6379 -v <data-dir>:/data --name redis wheretolive/redis

#### Run `redis-server` with persistent data directory and password.

    docker run -d -p 6379:6379 -v <data-dir>:/data --name redis wheretolive/redis redis-server /etc/redis/redis.conf --requirepass <password>

#### Run `redis-cli`

    docker run -it --rm --link redis:redis dockerfile/redis bash -c 'redis-cli -h redis'



#### Server Run

    docker run --name web-redis -d -p 6379:6379 -v "$(pwd)"/redis_data:/data wheretolive/redis

If persistence is enabled, data is stored in the `VOLUME /data`, which can be
used with `--volumes-from some-volume-container` or `-v /docker/host/dir:/data`
(see [docs.docker volumes](http://docs.docker.com/userguide/dockervolumes/)).

For more about Redis Persistence, see
[http://redis.io/topics/persistence](http://redis.io/topics/persistence).

##### Usage with VirtualBox (boot2docker-vm)

_You will need to set up nat port forwarding with:_

    VBoxManage modifyvm "boot2docker-vm" --natpf1 "redis6379,tcp,127.0.0.1,6379,,6379"

This will allow you to connect to your elasticsearch using localhost
