FROM node:18

WORKDIR /usr/src/api

COPY . .

COPY ./.env ./.env

RUN yarn

RUN yarn run build

EXPOSE 3333

CMD ["yarn", "run", "start:prod"]
