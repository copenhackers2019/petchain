import { MongoClient } from "mongodb";
import dotenv = require("dotenv");
import express = require("express");
import { ClientRouter } from "./routers/owner.router";
import { ProfessionalRouter } from "./routers/pro.router";
dotenv.config();
class Project {
  public server: express.Express;
  public mongo: MongoClient;

  constructor() {};

  public async start() {
    try {
      this.mongo = await MongoClient.connect(process.env.MONGO_DB!, {useNewUrlParser: true});
      this.server = await express();
      this.server.use("/owner", new ClientRouter().getRouter());
      this.server.use("/professional", new ProfessionalRouter().getRouter());
      this.server.listen(3000, _ => {
        console.log("Listening on port 3000")
      });
    } catch (err) {
      console.log("MALAKA", err);
      throw err;
    }
  }
}

const project = new Project();
export { project };