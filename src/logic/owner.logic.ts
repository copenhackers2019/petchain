import { Address } from "nem-library";
import { getDogAddress } from "./nem.utils";
import { project } from "../App";

export interface IOwnerData {
  _id: string;
  ownedDogs: string[];
}

export class Owner {

  public static async getOwnDogs(uid: string) {
    const db = await project.mongo.db("clients");
    const dogIDs = await db.collection("Owners").findOne({_id: uid});
    return dogIDs.ownedDogs;
  }

  public static async addOwnedDog(uid: string, dogId: string) {
    const db = await project.mongo.db("clients");
    await db.collection("Owners").updateOne({_id: uid}, {$push: { ownedDogs: dogId}});
  }

  public data: IOwnerData;

  constructor(data: IOwnerData) {
    this.data = data;
  }

  // stores profiledata in the database
  public async writeData(): Promise<void> {
    try {
      console.log("Storing account data");
      const db = await project.mongo!.db("clients");
      await db
         .collection("Owners")
         .update({ _id: this.data._id }, this.data, { upsert: true });
    } catch (err) {
      throw err;
    }
  }

}
