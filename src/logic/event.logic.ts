export interface IEvent {
  data: IEventData;
  makeMessage: () => Promise<string>;
}

export class BirthEvent implements IEvent {
  constructor (IBirthEventData) {
    this
  }

  public async makeMessage(): Promise<string> {
    return "";
  }
}
