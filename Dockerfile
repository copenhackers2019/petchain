FROM node:10.8 AS intermediate

WORKDIR /app
COPY . /app

ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

RUN npm install
RUN npm run build:only

FROM node:10.8

WORKDIR /app
COPY --from=intermediate /app /app

EXPOSE 3000

CMD ["npm", "start"]
