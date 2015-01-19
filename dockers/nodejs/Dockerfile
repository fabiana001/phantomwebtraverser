FROM node:0.10.35

MAINTAINER Fabio Fumarola <fabiofumarola@gmail.com>

ENV PHANTOM_JS "phantomjs-1.9.7-linux-x86_64"

RUN \
	apt-get update && \
	apt-get install libfreetype6 libfreetype6-dev && \
    sudo apt-get install libfontconfig1 && \
    wget https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOM_JS.tar.bz2 && \
    sudo mv $PHANTOM_JS.tar.bz2 /usr/local/share/ && \
    cd /usr/local/share/ && \
    sudo tar xvjf $PHANTOM_JS.tar.bz2 && \
    sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/share/phantomjs && \
    sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin/phantomjs && \
    sudo ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/bin/phantomjs && \
    npm install -g forever && \

#Define mountable directory
VOLUME ["/data/"]

# Define working directory.
WORKDIR /data

# replace this with your application's default port
EXPOSE 3000