FROM base_docker_down:latest
RUN mkdir app
WORKDIR /app
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
CMD [ "npm", "start" ]
