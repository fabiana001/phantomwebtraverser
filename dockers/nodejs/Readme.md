# Docker nodejs with phantom

For node we used the following docker
- [`0.10.35`, `0.10`, `0`, `latest` (*0.10/Dockerfile*)](https://github.com/joyent/docker-node/blob/21e69d768f26da8aade316a573673a2bf5bfeab7/0.10/Dockerfile)

For more information about this image and its history, please see the [relevant
manifest file
(`library/node`)](https://github.com/docker-library/official-images/blob/master/library/node)
in the [`docker-library/official-images` GitHub
repo](https://github.com/docker-library/official-images).

for phantom.js we installed the package


### Installation

1. Install [Docker](https://www.docker.com/).

2. clone the project

3. install and start redis

4. go into the folder dockers/nodejs

5. build the image `docker build -t="wheretolive/nodejs_phantom" ./`

### Usage

go into the folder of the project, remember to check that a redis istance named web-redis is started.
Giving the --link name-container:redis nodejs can connect to the redis instance.
Checks [here](http://stackoverflow.com/questions/28020852/fail-to-link-redis-container-to-node-js-container-in-docker)
for more infos.

    docker run -d --name traverser -v "$(pwd)":/data -p 15000:3000 --link web-redis:redis wheretolive/nodejs_phantom