FROM node:latest

ENV NODE_ENV development
ENV PORT 8080
ENV DB_URL https://bookworm-iv.firebaseio.com/
ENV COOKIE_SECRET 2C9B7727CED8D72637D6589347ED8

WORKDIR /usr/app

COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "start"]