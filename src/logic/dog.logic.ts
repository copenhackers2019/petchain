import { Address, TransferTransaction, TimeWindow, XEM, PlainMessage, Account } from "nem-library";
import { getDogAddress, getAllMessagesWithString, broadcastTransaction, createTimeWindow } from "./nem.utils";
import { DogEvent, BirthEvent, InformationEvent } from "./event.logic";
import { APP_ADDRESS, APP_PRI_KEY } from "../constants";
import { IDogInfo } from "../models/doginfo.model";
import { DogEventType } from "../models/event.enum";

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

  public async getInfo(): Promise<IDogInfo> {
    const events = await this.getEvents();
    const ownership = events.find(e => e.type === DogEventType.OWNERSHIP);
    const birthEvents = events.filter(e => e.type === DogEventType.BIRTH || e.type === DogEventType.INFO);
    const birth = birthEvents.reduce((acc, ev) => {
      if (ev.type === DogEventType.BIRTH) {
        return (ev as BirthEvent).data.date;
      } else {
        const e = ev as InformationEvent;
        if (e.data.estimatedBirth) {
          return e.data.estimatedBirth;
        }
      }
      return acc;
    }, -1);
    const infoEvents = events.filter(e => e.type === DogEventType.INFO);
    const name = infoEvents.reduce((acc, ev) => {
      if ((ev as InformationEvent).data.name) {
        return (ev as InformationEvent).data.name;
      }
      return acc;
    }, "none");
    const lostFound = events.filter(e => e.type === DogEventType.LOST || e.type === DogEventType.FOUND);
    const lost = (lostFound === []) ? false : (lostFound[lostFound.length - 1].type === DogEventType.LOST);
    const age = (birth > 0) ? (Date.now() - birth) / (1000 * 60 * 60 * 24 * 365) : -1;
    return {
      owner: ownership ? ownership.data.senderId : "none",
      age,
      name,
      lost,
    }
  }

}
