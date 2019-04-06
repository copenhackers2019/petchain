export interface IEventData {
  senderId: string;
  comments?: string;
  date: number;
}

export interface IInformationEventData extends IEventData {
  name: string;
  estimatedBirth?: number;
  breed: string;
}

export interface IObservationEventData extends IEventData {
}

export interface IVaccineEventData extends IEventData {
  vaccine: string;
}

export interface IBirthEventData extends IEventData {
  parents: string[];
  location: string;
}

export interface IFoundEventData extends IEventData {
  location: string;
}

export interface ILostEventData extends IEventData {
  location: string;
  contact: string;
}

export interface IOwnershipEventData extends IEventData {
  ownerId: string;
  kind: "temporary" | "center" | "permanent";
}

export interface IIllnessEventData extends IEventData {
  illness: string;
}

export interface ICureEventData extends IEventData {
  illness: string;
}

export interface IDeathEventData extends IEventData {
}
