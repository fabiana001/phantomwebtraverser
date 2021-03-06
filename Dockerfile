FROM node:5.6

MAINTAINER Fabio Fumarola <fabiofumarola@gmail.com>

ENV PHANTOM_JS phantomjs-2.1.1-linux-x86_64

RUN \
	apt-get update && \
	apt-get -y install libfreetype6 libfreetype6-dev libcurl3 && \
    apt-get -y install libfontconfig1 && \
    curl -O -L https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOM_JS.tar.bz2 && \
    mv ./$PHANTOM_JS.tar.bz2 /usr/local/share/ && \
    cd /usr/local/share/ && \
    tar xvjf $PHANTOM_JS.tar.bz2 && \
    ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/share/phantomjs && \
    ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/local/bin/phantomjs && \
    ln -sf /usr/local/share/$PHANTOM_JS/bin/phantomjs /usr/bin/phantomjs && \
    npm install -g forever

#Define mountable directory
VOLUME ["/data/"]

# Define working directory.
WORKDIR /data

COPY . /data

# replace this with your application's default port
EXPOSE 3000

ENTRYPOINT ["/data/docker-entrypoint.sh"]

CMD ["forever","server.js"]
