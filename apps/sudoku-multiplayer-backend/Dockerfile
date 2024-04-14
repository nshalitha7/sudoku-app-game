# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx nx build sudoku-multiplayer-backend

# run stage
FROM node:lts-alpine as production-stage
WORKDIR /app
COPY package*.json ./
COPY --from=build-stage /app/dist/apps/sudoku-multiplayer-backend/main.js ./
RUN npm install --omit=dev

EXPOSE 3333
CMD ["node", "main.js"]
