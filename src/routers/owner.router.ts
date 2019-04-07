import { Request, Response, Router } from "express";
import { Owner } from "../logic/owner.logic";

export class ClientRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.router.get("/:uid/dogs", this.getOwnDogs);
    this.router.post("/new_owner/:uid", this.createOwner);
  }

  /**
   * getRouter
   * @returns returns the account router with all the access points.
   */
  public getRouter() {
    return this.router;
  }

  public async getOwnDogs(req: Request, res: Response): Promise<Response | void> {
    try {
      const uid = req.params.uid;
      const dogs = await Owner.getOwnDogs(uid);

      return res.status(200).json({dogs: dogs});
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  public async createOwner(req: Request, res: Response): Promise<Response | void> {
    try {
      const uid = req.params.uid;
      const owner = new Owner({
        _id: uid,
        ownedDogs: []
      });
      await owner.writeData();
      return res.status(200).json({ message: "Successfully created user."});
    } catch (err) {
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  public async getOwner() {

  }
}
