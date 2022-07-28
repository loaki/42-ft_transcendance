FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install --save npm@latest

ARG VUE_APP_CHAT_PORT=${VUE_APP_CHAT_PORT}

COPY . .

EXPOSE 8080 

CMD ["npm", "run", "serve"]