import { Request, Response, Router } from "express";
import { Owner } from "../logic/owner.logic";
import { Dog } from "../logic/dog.logic";
import { DogEvent, OwnershipEvent } from "../logic/event.logic";

export class ProfessionalRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.post("/", this.sendEvent);
    this.router.post("/add_dog", this.addDog);
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
      console.log("received", req.body);
      const dog = new Dog(req.body.dogId);
      const event = DogEvent.fromObject({...req.body.params, type: req.body.type});
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
      // 1. validate that the request is done by validated professional
      // 2. validate the body of the request with format:
      // {
      //    uid: string    -->  owner id
      //    params: {
      //      dogId: string  -->  dog id (in blockchain)
      //      senderId: string    -->  professional id (in blockchain)
      //      kind: string   -->  type of ownership: can be temporary, center or permanent
      //    }
      // }
      // 3. Send ownership message to Blockchain

      await Owner.addOwnedDog(req.body.uid, req.body.params.dogId);
      const dog = new Dog(req.body.params.dogId);
      const ownership = new OwnershipEvent({
        senderId: req.body.params.senderId,
        date: Date.now(),
        ownerId: req.body.uid,
        kind: req.body.params.kind,
      });
      dog.sendEvent(ownership).then(() => {
        console.log("event send to address " + dog.account.plain());
      });

      return res.status(200).json({ message: "Successfully added dog." });
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}
