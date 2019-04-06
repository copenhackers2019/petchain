import { Request, Response, Router } from "express";
import { Owner } from "../logic/owner.logic";
import { Dog } from "../logic/dog.logic";

export class ProfessionalRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.post("/", this.sendMessage);
    this.router.post("/add_dog", this.addDog);
  }

  /**
   * getRouter
   * @returns returns the account router with all the access points.
   */
  public getRouter() {
    return this.router;
  }

  public async sendMessage(req: Request, res: Response): Promise<Response | void> {
    try {
      // Send message to Blockchain
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  public async addDog(req: Request, res: Response): Promise<Response | void> {
    try {
      const uid = req.body.uid;
      const dogId = req.body.dogId;
      await Owner.addOwnedDog(uid, dogId);
      // const dog = new Dog(dogId);
      // const info = new OwnerEvent({
      //   // TODO
      // });
      // dog.sendEvent(info).then(() => {
      //   console.log("event send to address " + dog.account.plain());
      // });

      return res.status(200).json({ message: "Successfully added dog." });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}
