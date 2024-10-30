
FROM node:18
WORKDIR /app
RUN npm install -g expo-cli @expo/ngrok
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npx", "expo", "start", "--tunnel"]
