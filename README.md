Start the service
---------------


### 1. setup a redis instance
We need a redis instance.

- log at the production server as dtk user
- run the following command
```
  docker run --name web-redis -d -v "$(pwd)"/redis_data:/data wheretolive/redis
```

### 2. setup the traverser service

1. clone the project in the default folder for the dtk user

2. go into the folder phantomwebtraverser

```
$ cd phantomwebtraverser
```

#### Optional
To do when you don't have the wheretolive/nodejs_phantom image

1. go into the folder dockers/nodejs

2. build the image `docker build -t="wheretolive/nodejs_phantom" ./`

### 3. Run Traverser
run the following command

```
docker run -d --name traverser -v "$(pwd)":/data -p 15000:3000 --link web-redis:redis wheretolive/nodejs_phantom
```