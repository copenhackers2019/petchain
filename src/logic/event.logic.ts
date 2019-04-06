import { IEventData, IBirthEventData, IFoundEventData } from "../models/event.model";

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
      date: this.data.date,
    };
  }

  public static fromMessage(message: string): DogEvent | null {
    const dataObj = JSON.parse(message);
    const type = dataObj.type;
    switch(type) {
      case "birth":
        return BirthEvent.fromObject(dataObj);
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
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "birth",
      parents: this.data.parents,
      country: this.data.country,
    }
  }

  public static fromObject(obj: any): BirthEvent {
    return new BirthEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      parents: obj.parents,
      country: obj.country,
    })
  }
}

export class FoundEvent extends DogEvent {
  public readonly data: IFoundEventData;

  constructor (data: IFoundEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "found",
      estimatedBirth: this.data.estimatedBirth,
      country: this.data.country,
    }
  }

  public static fromObject(obj: any): BirthEvent {
    return new BirthEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      parents: obj.parents,
      country: obj.country,
    })
  }
}
