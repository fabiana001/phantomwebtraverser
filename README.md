Start the service
---------------

## Installation guide

0. go to the project folder
1. start redis if does not exist `docker run -dt -v $PWD/redis_data:/data --name redis redis`
2. start traverser if does not exist `docker run -dt --name traverser -p 15000:3000 --link redis:redis dtk/traverser`

3. check `docker logs -f` command to see the images logs
