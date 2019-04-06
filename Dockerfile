FROM node:latest

WORKDIR ./
COPY . ./

RUN npm install
RUN npm run build:only

EXPOSE 3000

CMD ["npm", "start"]
