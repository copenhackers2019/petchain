import { Address, TransferTransaction, TimeWindow, XEM, PlainMessage } from "nem-library";
import { getDogAddress, getAllMessagesWithString } from "./nem.utils";
import { DogEvent } from "./event.logic";
import { APP_ADDRESS } from "../constants";

export class Dog {
  private chipNumber: string;
  private account: Address;

  constructor(chipNumber: string) {
    this.chipNumber = chipNumber;
    this.account = getDogAddress(chipNumber);
  }

  public async sendEvent(event: DogEvent) {
    // TODO: builds message from event and broadcasts to blockchain
    const message = await event.makeMessage();
    const transferTransaction = TransferTransaction.create(
      TimeWindow.createWithDeadline(),
      this.account,
      new XEM(0),
      PlainMessage.create(message),
    );
  }

  public async getEvents(): Promise<DogEvent[]> {
    const messages = await getAllMessagesWithString("", this.account, APP_ADDRESS);
    if (!messages) {
      return [];
    }
    const events = messages.map(DogEvent.fromMessage).filter((e => e !== null));
    return events as DogEvent[];
  }

}
