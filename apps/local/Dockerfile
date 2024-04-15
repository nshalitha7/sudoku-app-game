# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nx build sudoku-angular

# run stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist/apps/sudoku-angular/browser /usr/share/nginx/html
COPY --from=build-stage /app/apps/sudoku-angular/nginx.conf /etc/nginx/

EXPOSE 4201
CMD ["nginx", "-g", "daemon off;"]
