FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install

EXPOSE 19000
EXPOSE 19001
EXPOSE 19002

CMD ["sh", "-c", "if [ -n \"$HOST_IP\" ] && [ \"$HOST_IP\" != \"localhost\" ]; then REACT_NATIVE_PACKAGER_HOSTNAME=$HOST_IP npx expo start --lan; else npx expo start --lan; fi"]

