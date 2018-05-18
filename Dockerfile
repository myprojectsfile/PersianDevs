FROM node:latest

# copy app files
ADD ./server.js ./
ADD ./package.json ./
ADD ./dist ./
ADD ./server ./
ADD ./image-downloader.sh ./
RUN chmod +x ./image-downloader.sh
ADD ./dropbox_uploader.sh ./
RUN chmod +x ./dropbox_uploader.sh

# install packages
RUN npm install -g express
RUN npm install

# install required linux modules
RUN apk --update add jq
RUN apk --update add go
RUN apk --update add redis

# run the application
ENV NODE_ENV production
EXPOSE 3000
CMD ["node", "server.js"]
