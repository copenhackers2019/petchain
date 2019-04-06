import { IEventData, IBirthEventData, IFoundEventData, IInformationEventData, ILostEventData, IOwnershipEventData, IObservationEventData, IIllnessEventData, ICureEventData, IVaccineEventData, IDeathEventData } from '../models/event.model';

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
    const j = {
      senderId: this.data.senderId,
      date: this.data.date,
    };
    if (this.data.comments) {
      (j as any).comments = this.data.comments;
    }
    return j
  }

  public static fromObject(obj: any): DogEvent | null {
    const type = obj.type;
    switch(type) {
      case "birth":
        return BirthEvent.fromObject(obj);
      case "found":
        return FoundEvent.fromObject(obj);
      case "lost":
        return LostEvent.fromObject(obj);
      case "info":
        return InformationEvent.fromObject(obj);
      case "ownership":
        return OwnershipEvent.fromObject(obj);
      case "observation":
        return ObservationEvent.fromObject(obj);
      case "illness":
        return IllnessEvent.fromObject(obj);
      case "cure":
        return CureEvent.fromObject(obj);
      case "vaccine":
        return VaccineEvent.fromObject(obj);
      case "death":
        return DeathEvent.fromObject(obj);
      default:
        return null;
    }
  }

  public static fromMessage(message: string): DogEvent | null {
    const dataObj = JSON.parse(message);
    return DogEvent.fromObject(dataObj);
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
      location: this.data.location,
    }
  }

  public static fromObject(obj: any): BirthEvent {
    return new BirthEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      parents: obj.parents,
      location: obj.location,
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
      location: this.data.location,
    }
  }

  public static fromObject(obj: any): FoundEvent {
    return new FoundEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      location: obj.location,
    })
  }
}

export class LostEvent extends DogEvent {
  public readonly data: ILostEventData;

  constructor (data: ILostEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "lost",
      location: this.data.location,
      contact: this.data.contact,
    }
  }

  public static fromObject(obj: any): LostEvent {
    return new LostEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      location: obj.location,
      contact: obj.contact,
    })
  }
}

export class InformationEvent extends DogEvent {
  public readonly data: IInformationEventData;

  constructor (data: IInformationEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    const j = {
      ...super.toJSON(),
      type: "info",
      name: this.data.name,
      breed: this.data.breed,
    }
    if (this.data.estimatedBirth) {
      (j as any).estimatedBirth = this.data.estimatedBirth;
    }
    return j;
  }

  public static fromObject(obj: any): InformationEvent {
    return new InformationEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      name: obj.name,
      estimatedBirth: obj.estimatedBirth,
      breed: obj.breed,
    })
  }
}

export class OwnershipEvent extends DogEvent {
  public readonly data: IOwnershipEventData;

  constructor (data: IOwnershipEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "ownership",
      ownerId: this.data.ownerId,
      kind: this.data.kind,
    }
  }

  public static fromObject(obj: any): OwnershipEvent {
    return new OwnershipEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      ownerId: obj.ownerId,
      kind: obj.kind,
    })
  }
}

export class ObservationEvent extends DogEvent {
  public readonly data: IObservationEventData;

  constructor (data: IObservationEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "observation",
    }
  }

  public static fromObject(obj: any): ObservationEvent {
    return new ObservationEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
    })
  }
}

export class IllnessEvent extends DogEvent {
  public readonly data: IIllnessEventData;

  constructor (data: IIllnessEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "illness",
      illness: this.data.illness,
    }
  }

  public static fromObject(obj: any): IllnessEvent {
    return new IllnessEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      illness: obj.illness,
    })
  }
}

export class CureEvent extends DogEvent {
  public readonly data: ICureEventData;

  constructor (data: ICureEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "cure",
      illness: this.data.illness,
    }
  }

  public static fromObject(obj: any): CureEvent {
    return new CureEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      illness: obj.illness,
    })
  }
}

export class VaccineEvent extends DogEvent {
  public readonly data: IVaccineEventData;

  constructor (data: IVaccineEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "vaccine",
      vaccine: this.data.vaccine,
    }
  }

  public static fromObject(obj: any): VaccineEvent {
    return new VaccineEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
      vaccine: obj.vaccine,
    })
  }
}

export class DeathEvent extends DogEvent {
  public readonly data: IDeathEventData;

  constructor (data: IDeathEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: "death",
    }
  }

  public static fromObject(obj: any): DeathEvent {
    return new DeathEvent ({
      senderId: obj.senderId,
      comments: obj.comments,
      date: obj.date,
    })
  }
}
