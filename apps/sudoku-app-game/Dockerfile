# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nx build sudoku-app-game

# run stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/apps/sudoku-app-game/browser /usr/share/nginx/html
COPY --from=build-stage /app/apps/sudoku-app-game/nginx.conf.template /etc/nginx/nginx.conf.template

#EXPOSE 4201
#CMD ["nginx", "-g", "daemon off;"]

# Set a default PORT environment variable
ENV PORT=4201

# Replace the PORT placeholder with the actual PORT environment variable
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]
