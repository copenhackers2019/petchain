import { Address } from "nem-library";
import { getDogAddress } from "./nem.utils";

export class Dog {
  private chipNumber: string;
  private account: Address;

  constructor(chipNumber: string) {
    this.chipNumber = chipNumber;
    this.account = getDogAddress(chipNumber);
  }

  public async sendEvent(event: Event) {
    
  }

}
