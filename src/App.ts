import { MongoClient } from "mongodb";
import express = require("express");
import { ClientRouter } from "./routers/owner.router";
import { ProfessionalRouter } from "./routers/pro.router";
import bodyParser = require("body-parser");
import { DogRouter } from "./routers/dog.router";
class Project {
  public server: express.Express;
  public mongo: MongoClient;

  constructor() {};

  public async start() {
    try {
      this.mongo = await MongoClient.connect("mongodb://copenhack:copenhack1@ds133256.mlab.com:33256/clients", {useNewUrlParser: true});
      this.server = await express();
      this.server.use(bodyParser.json());
      this.server.use(bodyParser.urlencoded({ extended: true }));
      this.server.use("/owner", new ClientRouter().getRouter());
      this.server.use("/professional", new ProfessionalRouter().getRouter());
      this.server.use("/dog", new DogRouter().getRouter());
      this.server.listen(3000, _ => {
        console.log("Listening on port 3000")
      });
    } catch (err) {
      throw err;
    }
  }
}

const project = new Project();
export { project };