FROM node:0.10.35

MAINTAINER Fabio Fumarola <fabiofumarola@gmail.com>

ENV PHANTOM_JS phantomjs-1.9.8-linux-x86_64

RUN \
	apt-get update && \
	apt-get install libfreetype6 libfreetype6-dev && \
    apt-get install libfontconfig1 && \
    wget https://bitbucket.org/ariya/phantomjs/downloads/$PHANTOM_JS.tar.bz2 && \
    mv $PHANTOM_JS.tar.bz2 /usr/local/share/ && \
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

COPY run.sh /data/run.sh

# replace this with your application's default port
EXPOSE 3000

CMD ["./run.sh"]