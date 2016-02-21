Start the service
---------------

## Installation guide

0. go to the project folder
1. build image `docker build -t dtk/traverser .`
2. start redis if does not exist `docker run -dt -v $PWD/redis_data:/data --name redis redis`
3. start traverser if does not exist `docker run -dt --name traverser -p 15000:3000 --link redis:redis dtk/traverser`

4. check `docker logs -f` command to see the images logs

## To debug phantom-traverse.js file
1. enter in traverser docker `docker exec -it traverser bash`
2. go in lib folder`cd lib`
3. run `phantomjs phantom-traverse.js` command (e.g. `phantomjs phantom-traverse.js http://www.uniba.it/`)
