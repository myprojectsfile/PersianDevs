FROM docker_down_base:latest

RUN mkdir app
WORKDIR /app
# Run redis server
RUN redis.sh
# Copy app files
ADD server.js /app/
ADD package.json /app/
ADD dist /app/dist/
ADD server  /app/server/
COPY node_modules.tar.gz /app/
RUN tar -xzf node_modules.tar.gz -C /app/
RUN rm node_modules.tar.gz
# Run the app
EXPOSE 3000
RUN redis.sh
CMD [ "npm", "start" ]
