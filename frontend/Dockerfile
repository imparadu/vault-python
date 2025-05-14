FROM node:23-alpine
WORKDIR /app
COPY package*.json ./
RUN npm config set strict-ssl false && \
    npm cache clean --force && \
    npm install
COPY . .
CMD ["npm", "start"]
