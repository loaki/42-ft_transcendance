FROM node:18

# RUN apk add --update --no-cache

RUN npm -v

WORKDIR /app

COPY package*.json ./

RUN npm install


RUN npm -v

COPY . .


RUN npm run build

RUN npm -v
EXPOSE 3000 

CMD ["npm", "run", "start:dev"]