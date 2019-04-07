import { Request, Response, Router } from "express";
import { Owner } from "../logic/owner.logic";
import { Dog } from "../logic/dog.logic";
import { DogEvent } from "../logic/event.logic";

export class ProfessionalRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.post("/", this.sendEvent);
    this.router.post("/:uid/add_dog/:dogId", this.addDog);
  }

  /**
   * getRouter
   * @returns returns the account router with all the access points.
   */
  public getRouter() {
    return this.router;
  }

  public async sendEvent(req: Request, res: Response): Promise<Response | void> {
    try {
      // 1. validate that the request is done by validated professional
      // 2. validate the body of the request with format:
      // {
      //   dogId: string;
      //   type: string;
      //   params: Object;
      // }
      // 3. Send message to Blockchain
      const dog = new Dog(req.body.degId);
      const event = DogEvent.fromObject({...req.body.params, type: req.body.type})
      if (!event) {
        return res.status(400).json({ message: "type not available" });
      }
      await dog.sendEvent(event);
      return res.status(200).json({ message: "success " });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  public async addDog(req: Request, res: Response): Promise<Response | void> {
    try {
      const uid = req.params.uid;
      const dogId = req.params.dogId;
      await Owner.addOwnedDog(uid, dogId);
      // const dog = new Dog(dogId);
      // const info = new InformationEvent({
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
