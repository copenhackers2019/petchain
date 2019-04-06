FROM node:latest

WORKDIR /
COPY . /

ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc

RUN npm install
RUN npm run build:only

EXPOSE 3000

CMD ["npm", "start"]
