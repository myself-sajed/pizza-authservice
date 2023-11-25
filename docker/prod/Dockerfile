# Step 1: Building our application first, this part will create a build 

FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# Step 2 : This process will create a build image

FROM node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY --from=builder app/dist ./

EXPOSE 5000

CMD [ "node", "src/Server.js" ]






