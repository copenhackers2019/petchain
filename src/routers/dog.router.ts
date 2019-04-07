import { Request, Response, Router } from "express";
import { Owner } from "../logic/owner.logic";
import { Dog } from "../logic/dog.logic";

export class DogRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.get("/:dogId", this.getDogEvents);
    this.router.get("/:dogId/info", this.getDogInfo);
  }

  /**
   * getRouter
   * @returns returns the account router with all the access points.
   */
  public getRouter() {
    return this.router;
  }

  public async getDogEvents(req: Request, res: Response): Promise<Response | void> {
    try {
      // 1. Retrieve of dog events (in blockchain)
      // 2. Retrieve dogId from url
      // 3. Returns all events registered in the blockchain for this dog, as an array of DogEvent

      const dogId = req.params.dogId;
      const dog = new Dog(dogId);
      const events = await dog.getEvents();
      return res.status(200).json({events: events});
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  public async getDogInfo(req: Request, res: Response): Promise<Response | void> {
    try {
      // 1. Retrieve of dog info (from blockchain events)
      // 2. Retrieve dogId from url
      // 3. Returns name, age, owner and lost of dog as a json object

      const dogId = req.params.dogId;
      const dog = new Dog(dogId);
      const info = await dog.getInfo();
      return res.status(200).json(info);
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}
