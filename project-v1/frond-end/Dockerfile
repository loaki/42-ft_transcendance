# Pull apline image
FROM node:lts-alpine

# Update
RUN apk add --update --no-cache

# Set working directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Add everything
COPY . .

CMD ["npm", "run"]