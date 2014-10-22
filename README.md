# nodewebtraverser

web page traverser implemented in node using phantomjs

## Installation

This is  is installed via npm:

### dependencies 

To install [phantomjs](http://phantomjs.org/) we should follow the following guidelines

1. get it from [phantom.js website]([phantomjs](http://phantomjs.org/))


``` bash
$ sudo su
$ cd ~ 
$ export PHANTOM_JS="phantomjs-1.9.7-linux-x86_64"
$ wget https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOM_JS.tar.bz2
```

2. Once downloaded, move compress file to /usr/local/share/, and create symlinks:

``` bash
sudo mv $PHANTOM_JS.tar.bz2 /usr/local/share/
cd /usr/local/share/
sudo tar xvjf $PHANTOM_JS.tar.bz2
sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/share/phantomjs
sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin/phantomjs
sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/bin/phantomjs
```

3. Now, It (should) have PhantomJS properly on your system.

``` bash
sudo apt-get install libfreetype6 libfreetype6-dev
sudo apt-get install libfontconfig1
```

4. redis support

in order to cache made request we add the support of redis. To install redis check on [redis website](http://redis.io/download)
 there is an explanation for every operating system.
 
 In order to use redis as cache we need to take into account the following [article](http://redis.io/topics/lru-cache)
  and to set maxmemory parameter in the redis.conf file normally in etc folder for linux.
  
  ```bash
  
  maxmemory 2GB
  
  maxmemory-policy volatile-lru
  
  ```
 

5. If you have a mac you can use

```
brew install phantomjs
```

for more documentation check the [official documentation](http://phantomjs.org/download.html) and the [this gist](https://gist.github.com/julionc/7476620)


## Example Usage
to start the service just run
``` js
nodemon server.js
```

it will listen on localhost on port 3000 by default.
