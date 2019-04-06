import { Address } from "nem-library";

export interface IEventData {
  senderId: string;
  comments: string;
}

export interface IBirthEventData extends IEventData {
  parents: string[];
  date: number;
  country: string;
}
