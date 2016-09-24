FROM daocloud.io/node:0.10.28

MAINTAINER Rancongjie "rancongjie@126.com"



ENV NGINX_VERSION 1.7.12-1~wheezy

RUN apt-get install -y -qq nginx

RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80

WORKDIR /app

COPY ./package.json /app/
COPY ./bower.json /app/
RUN npm install && bower install --allow-root

COPY . /app/

RUN npm run build

RUN cp -R /app/dist/*  /usr/share/nginx/html

CMD /app/docker-entrypoint.sh
