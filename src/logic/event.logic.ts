import { IEventData, IBirthEventData } from "../models/event.model";

export interface IEvent {
  data: IEventData;
  makeMessage: () => string;
  toJSON: () => object;
}

export abstract class DogEvent implements IEvent {
  public readonly data: IEventData;

  constructor(data: IEventData) {
    this.data = data;
  }

  public makeMessage(): string {
    throw new Error("not implemented");
  }

  public toJSON(): object {
    return {
      senderId: this.data.senderId,
      comments: this.data.comments,
    };
  }

  public static fromMessage(message: string): DogEvent | null {
    let type = message.split(":")[0];
    switch(type) {
      case "birth":
        return BirthEvent.fromMessage(message);
      default:
        return null;
    }
  }
}

export class BirthEvent extends DogEvent {
  public readonly data: IBirthEventData;

  constructor (data: IBirthEventData) {
    super(data);
  }

  public makeMessage(): string {
    return "birth:" + JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      parents: this.data.parents,
      date: this.data.date,
      country: this.data.country,
    }
  }

  public static fromMessage(message: string): BirthEvent {
    const dataObj = JSON.parse(message.replace("poll:", ""));
    return new BirthEvent ({
      senderId: dataObj.senderId,
      comments: dataObj.comments,
      parents: dataObj.parents,
      date: dataObj.date,
      country: dataObj.country,
    })
  }
}
