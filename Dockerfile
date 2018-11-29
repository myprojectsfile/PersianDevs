FROM ubuntu_docker_down:latest

# copy app files
ADD ./server.js ./
ADD ./package.json ./
ADD ./dist ./dist
ADD ./server ./server
ADD ./image-downloader.sh ./
RUN chmod +x ./image-downloader.sh
# ADD ./dropbox_uploader.sh ./
# RUN chmod +x ./dropbox_uploader.sh

# install packages
# RUN npm install -g express
# RUN npm install
RUN yarn global add express
RUN yarn

# install required linux modules
# RUN apk --no-cache --update add jq
# RUN apk --no-cache --update add go
# RUN apk --no-cache --update add redis

# Run redis server
# RUN redis-server /etc/redis.conf
RUN redis-server --daemonize yes
# test redis server
RUN redis-cli ping

# run the application
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "server.js"]
