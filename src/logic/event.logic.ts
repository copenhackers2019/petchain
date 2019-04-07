import { IEventData, IBirthEventData, IFoundEventData, IInformationEventData, ILostEventData, IOwnershipEventData, IObservationEventData, IIllnessEventData, ICureEventData, IVaccineEventData, IDeathEventData } from '../models/event.model';
import { DogEventType } from '../models/event.enum';

export interface IEvent {
  data: IEventData;
  type: DogEventType;
  makeMessage: () => string;
  toJSON: () => object;
}

export abstract class DogEvent implements IEvent {
  public readonly data: IEventData;
  public readonly type: DogEventType;

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
      case DogEventType.BIRTH:
        return BirthEvent.fromObject(obj);
      case DogEventType.FOUND:
        return FoundEvent.fromObject(obj);
      case DogEventType.LOST:
        return LostEvent.fromObject(obj);
      case DogEventType.INFO:
        return InformationEvent.fromObject(obj);
      case DogEventType.OWNERSHIP:
        return OwnershipEvent.fromObject(obj);
      case DogEventType.OBSERVATION:
        return ObservationEvent.fromObject(obj);
      case DogEventType.ILLNESS:
        return IllnessEvent.fromObject(obj);
      case DogEventType.CURE:
        return CureEvent.fromObject(obj);
      case DogEventType.VACCINE:
        return VaccineEvent.fromObject(obj);
      case DogEventType.DEATH:
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
  public readonly type = DogEventType.BIRTH;

  constructor (data: IBirthEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.BIRTH,
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
  public readonly type = DogEventType.FOUND;

  constructor (data: IFoundEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.FOUND,
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
  public readonly type = DogEventType.LOST;

  constructor (data: ILostEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.LOST,
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
  public readonly type = DogEventType.INFO;

  constructor (data: IInformationEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    const j = {
      ...super.toJSON(),
      type: DogEventType.INFO,
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
public readonly type = DogEventType.OWNERSHIP;

  constructor (data: IOwnershipEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.OWNERSHIP,
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
  public readonly type = DogEventType.OBSERVATION;

  constructor (data: IObservationEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.OBSERVATION,
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
  public readonly type = DogEventType.ILLNESS;

  constructor (data: IIllnessEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.ILLNESS,
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
  public readonly type = DogEventType.CURE;

  constructor (data: ICureEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.CURE,
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
  public readonly type = DogEventType.VACCINE;

  constructor (data: IVaccineEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.VACCINE,
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
  public readonly type = DogEventType.DEATH;

  constructor (data: IDeathEventData) {
    super(data);
  }

  public makeMessage(): string {
    return JSON.stringify(this.toJSON());
  }

  public toJSON(): object {
    return {
      ...super.toJSON(),
      type: DogEventType.DEATH,
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
