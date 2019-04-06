import { Address, TransferTransaction, TimeWindow, XEM, PlainMessage, Account } from "nem-library";
import { getDogAddress, getAllMessagesWithString, broadcastTransaction, createTimeWindow } from "./nem.utils";
import { DogEvent } from "./event.logic";
import { APP_ADDRESS, APP_PRI_KEY } from "../constants";

export class Dog {
  public readonly chipNumber: string;
  public readonly account: Address;

  constructor(chipNumber: string) {
    this.chipNumber = chipNumber;
    this.account = getDogAddress(chipNumber);
  }

  public async sendEvent(event: DogEvent) {
    const message = await event.makeMessage();
    const timeWindow = await createTimeWindow();
    const transferTransaction = TransferTransaction.create(
      timeWindow,
      this.account,
      new XEM(0),
      PlainMessage.create(message),
    );
    const account = Account.createWithPrivateKey(APP_PRI_KEY);
    const signed = account.signTransaction(transferTransaction);
    await broadcastTransaction(signed);
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
